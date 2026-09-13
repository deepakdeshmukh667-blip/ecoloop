-- ==============================================================================
-- EcoLoop: Separate Resident and Admin Authentication & Strict RLS Migration
-- ==============================================================================

-- 1. Ensure profiles table role column is flexible TEXT with CHECK constraint
-- This prevents the PostgreSQL 55P04 error ("unsafe use of new value in enum")
DO $$
BEGIN
    -- If profiles table exists and role is an enum, convert it to text
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
        ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT USING role::text;
        ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'resident';
        
        -- Drop any previous role check constraints
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS user_role_check;
        
        -- Add check constraint for allowed roles
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
            CHECK (role IN ('resident', 'admin', 'society_admin', 'municipal_admin'));
    END IF;
END $$;

-- Also add 'admin' to user_role enum if the enum type exists (for backward compatibility)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        BEGIN
            ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
            WHEN OTHERS THEN NULL;
        END;
    END IF;
END $$;

-- 2. Ensure profiles table exists with all required columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auth_user_id UUID,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT DEFAULT 'Eco Resident',
    role TEXT DEFAULT 'resident' CHECK (role IN ('resident', 'admin', 'society_admin', 'municipal_admin')),
    society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
    building TEXT,
    flat_number TEXT,
    avatar_url TEXT DEFAULT '/deepak-avatar.png',
    eco_points INTEGER DEFAULT 50 CHECK (eco_points >= 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    consistency_score NUMERIC(5,2) DEFAULT 80.00 CHECK (consistency_score >= 0 AND consistency_score <= 100),
    total_verifications INTEGER DEFAULT 0,
    tier_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure auth_user_id column exists if table was created previously
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN auth_user_id UUID;
    END IF;
END $$;

-- 3. Automatic Profile Creation Trigger on Supabase auth.users Signup
-- When a user authenticates for the first time via OTP (shouldCreateUser: true),
-- this trigger guarantees they are created as a standard 'resident'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        auth_user_id,
        email,
        full_name,
        role,
        eco_points,
        current_streak,
        consistency_score,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'resident', -- ALWAYS default to resident; role cannot be set by client
        50,         -- Welcome bonus points
        0,
        80.00,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Prevent Frontend Role Escalation
-- Enforces that a user can NEVER change their own role in the database.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed, ensure it is NOT initiated by an unprivileged client
    IF OLD.role::text IS DISTINCT FROM NEW.role::text THEN
        -- Only service_role or database superusers can alter roles
        IF current_user NOT IN ('postgres', 'supabase_admin') AND auth.role() = 'authenticated' THEN
            RAISE EXCEPTION 'Unauthorized: Users cannot alter their own account role.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_profile_role_protection ON public.profiles;
CREATE TRIGGER enforce_profile_role_protection
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_escalation();

-- 5. Row Level Security (RLS) Policies on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clean up existing profile policies if present to prevent conflicts
DROP POLICY IF EXISTS "Public read profiles for leaderboard" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-sensitive fields" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id);

-- Public leaderboard read
CREATE POLICY "Public read profiles for leaderboard"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can update only their own profile details (full_name, avatar, flat_number)
CREATE POLICY "Users can update own profile non-sensitive fields"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

-- Admins have full access to view all society profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE (id = auth.uid() OR auth_user_id = auth.uid())
              AND role::text IN ('admin', 'society_admin', 'municipal_admin')
        )
    );

-- Also allow authenticated users to insert their own profile on signup/first login if needed
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);
