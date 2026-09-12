-- EcoLoop Gamified Waste Segregation Database Migration
-- Includes RLS, Constraints, Foreign Keys, Indexes & Storage Buckets

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SOCIETIES
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    ward TEXT NOT NULL,
    zone TEXT NOT NULL,
    license_number TEXT,
    total_units INTEGER DEFAULT 0,
    active_units INTEGER DEFAULT 0,
    compliance_rate NUMERIC(5,2) DEFAULT 0.00,
    consistency_index NUMERIC(5,2) DEFAULT 0.00,
    landfill_diversion_tons NUMERIC(8,2) DEFAULT 0.00,
    total_eco_currency BIGINT DEFAULT 0,
    spot_check_interval_days INTEGER DEFAULT 14,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Users linked to auth.users or standalone demo)
CREATE TYPE user_role AS ENUM ('resident', 'society_admin', 'municipal_admin');

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'resident',
    society_id UUID REFERENCES societies(id) ON DELETE SET NULL,
    building TEXT,
    flat_number TEXT,
    avatar_url TEXT,
    eco_points INTEGER DEFAULT 0 CHECK (eco_points >= 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    consistency_score NUMERIC(5,2) DEFAULT 0.00 CHECK (consistency_score >= 0 AND consistency_score <= 100),
    total_verifications INTEGER DEFAULT 0,
    tier_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{"theme": "system", "sound": true, "pushNotifications": true}'::jsonb,
    privacy_settings JSONB DEFAULT '{"photoVerification": true, "continuousSurveillance": false, "locationTracking": false, "dataSharing": "controlled", "photoRetentionDays": 30}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WASTE CATEGORIES
CREATE TABLE IF NOT EXISTS waste_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- 'wet', 'dry', 'special'
    name TEXT NOT NULL,
    bin_name TEXT NOT NULL,
    bin_color TEXT NOT NULL,
    description TEXT NOT NULL,
    base_points INTEGER DEFAULT 10,
    badge_label TEXT,
    examples TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VERIFICATIONS
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'needs_attention', 'rejected');

CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES waste_categories(id),
    image_url TEXT,
    image_storage_path TEXT,
    is_spot_check BOOLEAN DEFAULT FALSE,
    ai_detected_category TEXT,
    ai_confidence NUMERIC(5,2),
    status verification_status DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 0,
    clean_bin_bonus INTEGER DEFAULT 0,
    streak_multiplier NUMERIC(3,2) DEFAULT 1.00,
    ai_feedback TEXT,
    contaminant_detected TEXT,
    correction_prompt TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SPOT CHECKS
CREATE TYPE spot_check_status AS ENUM ('requested', 'completed', 'missed', 'waived');

CREATE TABLE IF NOT EXISTS spot_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    verification_id UUID REFERENCES verifications(id) ON DELETE SET NULL,
    scheduled_date DATE DEFAULT CURRENT_DATE,
    deadline_at TIMESTAMPTZ,
    status spot_check_status DEFAULT 'requested',
    bonus_multiplier NUMERIC(3,2) DEFAULT 2.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. REWARDS & REDEMPTIONS
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    partner_name TEXT,
    required_points INTEGER NOT NULL CHECK (required_points > 0),
    stock_quantity INTEGER DEFAULT 100,
    image_url TEXT,
    badge_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    voucher_code TEXT UNIQUE,
    status TEXT DEFAULT 'redeemed', -- 'redeemed', 'used', 'expired'
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACHIEVEMENTS & USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    target_count INTEGER DEFAULT 1,
    category TEXT DEFAULT 'general',
    points_reward INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    is_broadcasted BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- 9. CHALLENGES & PARTICIPANTS
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_metric TEXT NOT NULL, -- 'landfill_diversion', 'zero_contamination', 'inter_tower'
    target_value NUMERIC(10,2) NOT NULL,
    current_value NUMERIC(10,2) DEFAULT 0.00,
    community_reward TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contributed_value NUMERIC(10,2) DEFAULT 0.00,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'verification_success', 'streak_boost', 'spot_check', 'reward_claimed', 'badge_unlocked', 'derby_update'
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EDUCATIONAL CONTENT
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    assigned_bin TEXT NOT NULL,
    golden_rule TEXT NOT NULL,
    split_instructions TEXT,
    hazard_warning TEXT,
    search_keywords TEXT[],
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_society_id ON profiles(society_id);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spot_checks_user_id ON spot_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_leaderboard_society ON profiles(society_id, eco_points DESC);

-- 13. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles
CREATE POLICY "Public read for leaderboard details" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own non-sensitive profile fields" ON profiles
    FOR UPDATE USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- Societies
CREATE POLICY "Public read societies" ON societies
    FOR SELECT USING (true);

-- Waste Categories & Education
CREATE POLICY "Public read waste categories" ON waste_categories
    FOR SELECT USING (true);

CREATE POLICY "Public read educational content" ON educational_content
    FOR SELECT USING (true);

-- Verifications
CREATE POLICY "Users read own verifications" ON verifications
    FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users insert own verifications" ON verifications
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Spot checks
CREATE POLICY "Users read own spot checks" ON spot_checks
    FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Rewards
CREATE POLICY "Public read rewards" ON rewards
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users read own redemptions" ON reward_redemptions
    FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users insert own redemptions" ON reward_redemptions
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Achievements
CREATE POLICY "Public read achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Public read user achievements" ON user_achievements
    FOR SELECT USING (true);

-- Challenges
CREATE POLICY "Public read challenges" ON challenges
    FOR SELECT USING (true);

CREATE POLICY "Users participate in challenges" ON challenge_participants
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Public read challenge participants" ON challenge_participants
    FOR SELECT USING (true);

-- Notifications
CREATE POLICY "Users read own notifications" ON notifications
    FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users update own notifications" ON notifications
    FOR UPDATE USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- 14. STORAGE BUCKETS (avatars, verification-photos, reward-images)
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('verification-photos', 'verification-photos', false),
    ('reward-images', 'reward-images', true)
ON CONFLICT (id) DO NOTHING;
