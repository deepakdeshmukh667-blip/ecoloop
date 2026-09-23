'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Profile,
  Society,
  WasteCategory,
  Reward,
  RewardRedemption,
  Achievement,
  Challenge,
  Verification,
  NotificationItem,
  EducationalItem,
  ThemeMode,
  UserRole,
  AdminResident,
  SpotCheck,
  AIVerificationResponse,
} from '@/types';
import { BALANCED_WASTE_DATASET } from '@/lib/ai/dataset';
import {
  INITIAL_PROFILE,
  DEFAULT_UNAUTHENTICATED_PROFILE,
  INITIAL_SOCIETY,
  INITIAL_CATEGORIES,
  INITIAL_REWARDS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_VERIFICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EDUCATIONAL_ITEMS,
  INITIAL_LEADERBOARD_RESIDENTS,
  INITIAL_ADMIN_RESIDENTS,
  INITIAL_SPOT_CHECKS,
} from '@/lib/data/seedData';

export function formatNameFromEmail(email: string): string {
  if (!email) return 'Resident Member';
  const namePart = email.split('@')[0];
  let clean = namePart.replace(/[0-9_.-]+/g, ' ').trim();
  if (!clean.includes(' ')) {
    if (clean.toLowerCase().startsWith('prachi')) {
      const rest = clean.slice(6);
      if (rest) {
        clean = `Prachi ${rest.charAt(0).toUpperCase() + rest.slice(1)}`;
      }
    }
  }
  if (!clean) return 'Resident Member';
  return clean
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

interface AppContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Auth & Active User / Profile
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loginUser: (email: string, role?: UserRole, customName?: string) => void;
  signOut: (portal?: 'resident' | 'admin') => Promise<void>;

  // Society
  society: Society;

  // Waste Categories
  categories: WasteCategory[];

  // Verification flow state
  selectedCategory: WasteCategory;
  setSelectedCategory: (cat: WasteCategory) => void;
  pendingImage: string | null;
  setPendingImage: (img: string | null) => void;
  lastVerification: Verification | null;
  setLastVerification: (v: Verification | null) => void;

  // Historical Verifications
  verifications: Verification[];
  addVerification: (
    catSlug: 'wet' | 'dry' | 'special',
    isSpotCheck?: boolean,
    imageUrl?: string,
    isContaminated?: boolean,
    aiResult?: AIVerificationResponse
  ) => Verification;

  // Rewards & Redemptions
  rewards: Reward[];
  redemptions: RewardRedemption[];
  redeemReward: (rewardId: string) => { success: boolean; message: string };

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (code: string) => void;

  // Challenges
  challenges: Challenge[];
  joinChallenge: (challengeId: string) => void;

  // Spot Checks
  isSpotCheckActive: boolean;
  triggerSpotCheck: () => void;
  dismissSpotCheck: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Educational Items
  educationalItems: EducationalItem[];

  // Leaderboard
  leaderboardResidents: typeof INITIAL_LEADERBOARD_RESIDENTS;

  // Admin Directory & Spot Checks
  residents: AdminResident[];
  spotChecks: SpotCheck[];

  // Modals
  isSpotCheckModalOpen: boolean;
  setIsSpotCheckModalOpen: (open: boolean) => void;
  isRewardModalOpen: boolean;
  setIsRewardModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme State with System listener
  const [theme, setThemeState] = useState<ThemeMode>('light');

  // Core Auth & Profile States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_UNAUTHENTICATED_PROFILE);
  const [activeRole, setActiveRole] = useState<UserRole>('resident');
  const [society] = useState<Society>(INITIAL_SOCIETY);
  const [categories] = useState<WasteCategory[]>(INITIAL_CATEGORIES);

  // Active Flow States
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>(INITIAL_CATEGORIES[0]);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [lastVerification, setLastVerification] = useState<Verification | null>(
    INITIAL_VERIFICATIONS[0]
  );
  const [verifications, setVerifications] = useState<Verification[]>(INITIAL_VERIFICATIONS);

  // Rewards & Redemptions
  const [rewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);

  // Achievements & Challenges
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [educationalItems] = useState<EducationalItem[]>(INITIAL_EDUCATIONAL_ITEMS);
  const [leaderboardResidents, setLeaderboardResidents] = useState(INITIAL_LEADERBOARD_RESIDENTS);

  // Admin Directory & Spot Checks
  const [residents, setResidents] = useState<AdminResident[]>(INITIAL_ADMIN_RESIDENTS);
  const [spotChecks, setSpotChecks] = useState<SpotCheck[]>(INITIAL_SPOT_CHECKS);

  // Notifications & Spot check
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isSpotCheckActive, setIsSpotCheckActive] = useState<boolean>(true);

  // Modals
  const [isSpotCheckModalOpen, setIsSpotCheckModalOpen] = useState<boolean>(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);

  // Apply Theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ecoloop-theme') as ThemeMode | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('ecoloop-theme', mode);
    } catch {
      // ignore in restrictive browser environments
    }

    const applyThemeToDOM = () => {
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else if (mode === 'light') {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }
      }
    };

    // If browser supports View Transitions API, use it for ultra-smooth transition
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        applyThemeToDOM();
      });
    } else {
      applyThemeToDOM();
    }
  };

  // Synchronize authenticated user profile with Supabase Auth
  useEffect(() => {
    try {
      const supabase = createClient();

      const loadUserProfile = async (userId: string, userEmail?: string) => {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (profileData) {
            const emailStr = (profileData.email || userEmail || '').toLowerCase();
            const isDeepak = emailStr.includes('deepak');
            let resolvedName = profileData.full_name;
            if (!resolvedName || resolvedName === 'Resident Member' || (!isDeepak && resolvedName.toLowerCase().includes('deepak'))) {
              resolvedName = formatNameFromEmail(emailStr);
            }

            const updated: Profile = {
              ...INITIAL_PROFILE,
              id: profileData.id,
              email: profileData.email || userEmail || '',
              full_name: resolvedName,
              role: profileData.role || 'resident',
              society_id: profileData.society_id || 'gvr-tower-b',
              building: profileData.building || 'Tower B (Orchid)',
              flat_number: profileData.flat_number || 'Apt 402B',
              avatar_url: profileData.avatar_url || '/deepak-avatar.png',
              eco_points: profileData.eco_points ?? 0,
              current_streak: profileData.current_streak ?? 0,
              consistency_score: profileData.consistency_score ? Number(profileData.consistency_score) : 0,
              total_verifications: profileData.total_verifications ?? 0,
              tier_level: profileData.tier_level ?? 1,
              is_active: profileData.is_active ?? true,
            };
            setProfile(updated);
            setIsAuthenticated(true);
            if (profileData.role) {
              setActiveRole(profileData.role);
            }
          } else if (error && error.code === 'PGRST116') {
            // Profile doesn't exist yet: create default resident profile in Supabase
            const newProfileData: Profile = {
              ...INITIAL_PROFILE,
              id: userId,
              email: userEmail || '',
              full_name: formatNameFromEmail(userEmail || ''),
              role: 'resident',
              society_id: 'gvr-tower-b',
              building: 'Tower B (Orchid)',
              flat_number: 'Apt 402B',
              avatar_url: '/deepak-avatar.png',
              eco_points: 0,
              current_streak: 0,
              consistency_score: 0,
              total_verifications: 0,
              tier_level: 1,
              is_active: true,
            };

            await supabase.from('profiles').upsert({
              id: userId,
              email: userEmail || '',
              full_name: newProfileData.full_name,
              role: 'resident',
              // Note: society_id is a UUID FK, do not pass string IDs
              eco_points: 0,
              current_streak: 0,
              consistency_score: 0,
              total_verifications: 0,
              tier_level: 1,
              is_active: true,
            }, { onConflict: 'id' });

            setProfile(newProfileData);
            setIsAuthenticated(true);
            setActiveRole('resident');
          }
        } catch (err) {
          console.error('Error fetching Supabase profile:', err);
        }
      };

      // 1. Check initial Supabase session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          loadUserProfile(user.id, user.email);
        } else {
          setIsAuthenticated(false);
          setProfile(DEFAULT_UNAUTHENTICATED_PROFILE);
        }
      });

      // 2. Listen to real-time Supabase Auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
          loadUserProfile(session.user.id, session.user.email);
        } else if (event === 'SIGNED_OUT' || !session?.user) {
          setIsAuthenticated(false);
          setProfile(DEFAULT_UNAUTHENTICATED_PROFILE);
          setActiveRole('resident');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.warn('Supabase auth listener initialization error:', err);
    }
  }, []);

  // Dynamically compute live leaderboard rankings whenever profile changes
  useEffect(() => {
    const community = INITIAL_LEADERBOARD_RESIDENTS.filter(
      (r) => r.id !== profile.id && (profile.email ? r.email !== profile.email : true)
    );

    const userEntry: Profile & { rank: number; badge_title?: string } = {
      ...profile,
      id: profile.id || 'user-resident',
      full_name: profile.full_name || 'Resident Member',
      rank: 1,
      badge_title:
        profile.eco_points >= 500
          ? 'Super Segregator'
          : profile.eco_points >= 300
          ? 'Waste Warrior'
          : profile.eco_points >= 100
          ? 'Rising Star'
          : 'Eco Starter',
    };

    const combined = [...community, userEntry].sort((a, b) => b.eco_points - a.eco_points);
    const ranked = combined.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    setLeaderboardResidents(ranked);
  }, [profile]);

  // Dynamically evaluate achievements based on live user progress
  useEffect(() => {
    const passedSpotChecks = spotChecks.filter(
      (s) => s.status === 'completed' && s.result?.verified !== false
    ).length;
    setAchievements((prev) =>
      prev.map((ach) => {
        let is_unlocked: boolean = false;
        let progress: number = 0;

        switch (ach.code) {
          case 'first_step':
            is_unlocked = (profile.total_verifications || 0) >= 1;
            progress = Math.min(ach.target_count, profile.total_verifications || 0);
            break;
          case '7_day_streak':
            is_unlocked = (profile.current_streak || 0) >= 7;
            progress = Math.min(ach.target_count, profile.current_streak || 0);
            break;
          case 'waste_warrior':
            is_unlocked = (profile.total_verifications || 0) >= 50;
            progress = Math.min(ach.target_count, profile.total_verifications || 0);
            break;
          case 'spot_check_champion':
            is_unlocked = passedSpotChecks >= 3;
            progress = Math.min(ach.target_count, passedSpotChecks);
            break;
          case 'zero_contamination':
            is_unlocked = (profile.total_verifications || 0) >= 30 && (profile.consistency_score || 0) >= 95;
            progress = Math.min(ach.target_count, profile.total_verifications || 0);
            break;
          case 'eco_leader':
            is_unlocked = (profile.eco_points || 0) >= 500;
            progress = Math.min(ach.target_count, profile.eco_points || 0);
            break;
          case 'community_champion':
            is_unlocked = (profile.eco_points || 0) >= 400;
            progress = (profile.eco_points || 0) >= 400 ? 2 : 0;
            break;
          case 'habit_ambassador':
            is_unlocked = false;
            progress = 0;
            break;
          default:
            is_unlocked = !!ach.is_unlocked;
            progress = ach.progress ?? 0;
            break;
        }

        return {
          ...ach,
          is_unlocked,
          progress,
          unlocked_at: is_unlocked ? (ach.unlocked_at || 'Recently') : undefined,
        };
      })
    );
  }, [profile.eco_points, profile.current_streak, profile.total_verifications, profile.consistency_score, spotChecks]);

  const loginUser = (userEmail: string, role: UserRole = 'resident', customName?: string) => {
    const formattedName = customName || formatNameFromEmail(userEmail);
    const updatedProfile: Profile = {
      ...INITIAL_PROFILE,
      id: `user-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: userEmail.trim().toLowerCase(),
      full_name: formattedName,
      role: role,
      society_id: 'gvr-tower-b',
      building: 'Tower B (Orchid)',
      flat_number: 'Apt 402B',
      avatar_url: '/deepak-avatar.png',
      is_active: true,
    };

    setProfile(updatedProfile);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const signOut = async (portal: 'resident' | 'admin' = 'resident') => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error during Supabase signout:', err);
    }

    setIsAuthenticated(false);
    setProfile(DEFAULT_UNAUTHENTICATED_PROFILE);

    if (typeof document !== 'undefined') {
      document.cookie = 'ecoloop_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'ecoloop_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }

    if (typeof window !== 'undefined') {
      if (portal === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/resident/login';
      }
    }
  };

  // Recalculate Consistency Score
  const calculateConsistencyScore = (
    verifiedCount: number,
    streak: number,
    spotCheckBonus: number
  ) => {
    const score = Math.min(
      100,
      Math.round(verifiedCount * 2.5 + streak * 3 + spotCheckBonus * 4 + 40)
    );
    return Math.max(score, 75);
  };

  // Add Verification
  const addVerification = (
    catSlug: 'wet' | 'dry' | 'special',
    isSpotCheck = false,
    imageUrl?: string,
    isContaminated = false,
    aiResult?: AIVerificationResponse
  ): Verification => {
    const category = categories.find((c) => c.slug === catSlug) || categories[0];

    // Determine strict acceptance or rejection based on independent AI validation
    const isRejected = isContaminated || (aiResult && aiResult.status !== 'verified');

    // Strict Rule:
    // If rejected / needs_attention / mismatch / low confidence -> strictly 0 points!
    // If verified -> award base points + clean bin bonus (or spot check bonus)
    const points = isRejected
      ? 0
      : (aiResult?.pointsAwarded ?? (isSpotCheck ? 20 : category.base_points));
    const bonus = isRejected
      ? 0
      : (aiResult?.cleanBinBonus ?? (isSpotCheck ? 10 : 5));
    const totalAwarded = points + bonus;

    const detectedCategoryName = aiResult?.detectedCategory
      ? (BALANCED_WASTE_DATASET[aiResult.detectedCategory]?.name || aiResult.detectedCategory)
      : (isRejected ? 'Contaminant Flagged' : category.name);

    const confidenceScore = aiResult?.confidence ?? (isRejected ? 89.2 : 95.8);

    const newVerification: Verification = {
      id: `v-${Date.now()}`,
      user_id: profile.id,
      category_id: category.id,
      category_slug: catSlug,
      status: isRejected ? (aiResult?.status || 'needs_attention') : 'verified',
      points_awarded: points,
      clean_bin_bonus: bonus,
      streak_multiplier: isRejected ? 1.0 : (isSpotCheck ? 2.0 : 1.2),
      ai_detected_category: detectedCategoryName,
      ai_confidence: confidenceScore,
      is_spot_check: isSpotCheck,
      image_url: imageUrl || (catSlug === 'wet' ? '/stitch_ecoloop_gamified_waste_segregation/ecoloop_ai_verification_results/screen.png' : undefined),
      contaminant_detected: aiResult?.contaminant || (isRejected ? 'Plastic item in organic bin' : undefined),
      correction_prompt: aiResult?.correctionPrompt || (isRejected ? 'Remove non-biodegradable item and re-scan.' : undefined),
      ai_feedback: aiResult?.feedback || (isRejected
        ? 'Segregation mismatch detected. 0 points awarded until correctly sorted.'
        : `Clean ${category.name} validated by EcoLoop AI. +${totalAwarded} points credited!`),
      verified_at: 'Just now',
      created_at: new Date().toISOString(),
    };

    setVerifications((prev) => [newVerification, ...prev]);
    setLastVerification(newVerification);

    // Update Profile points & streak ONLY if accepted & verified (0 points if rejected)
    if (!isRejected && totalAwarded > 0) {
      setProfile((prev) => {
        const nextStreak = prev.current_streak + 1;
        const nextPoints = prev.eco_points + totalAwarded;
        const nextCount = prev.total_verifications + 1;
        const nextConsistency = calculateConsistencyScore(
          nextCount,
          nextStreak,
          isSpotCheck ? 2 : 1
        );

        return {
          ...prev,
          eco_points: nextPoints,
          current_streak: nextStreak,
          total_verifications: nextCount,
          consistency_score: nextConsistency,
        };
      });

      // Update Leaderboard ONLY if points were awarded
      setLeaderboardResidents((prev) =>
        prev.map((r) =>
          r.id === profile.id
            ? {
                ...r,
                eco_points: r.eco_points + totalAwarded,
                current_streak: r.current_streak + 1,
              }
            : r
        )
      );
    }

    // Create Notification (always — for both verified and rejected verifications)
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: profile.id,
      title: isRejected ? 'Segregation Mismatch (0 pts)' : `Waste Verified (+${totalAwarded} pts)`,
      message: isRejected
        ? (aiResult?.feedback || 'Waste segregation mismatch. Please re-scan with correctly sorted items.')
        : `${category.name} verified cleanly with ${confidenceScore}% accuracy.`,
      type: isRejected ? 'verification_attention' : 'verification_success',
      is_read: false,
      action_url: isRejected ? '/resident/verify/correction' : '/resident/history',
      created_at: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newVerification;
  };

  // Redeem Reward
  const redeemReward = (rewardId: string): { success: boolean; message: string } => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found.' };

    if (profile.eco_points < reward.required_points) {
      return {
        success: false,
        message: `Insufficient points! You need ${reward.required_points - profile.eco_points} more points to claim this voucher.`,
      };
    }

    const code = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const redemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      user_id: profile.id,
      reward_id: reward.id,
      reward_title: reward.title,
      points_spent: reward.required_points,
      voucher_code: code,
      status: 'redeemed',
      redeemed_at: 'Just now',
    };

    setRedemptions((prev) => [redemption, ...prev]);
    setProfile((prev) => ({
      ...prev,
      eco_points: prev.eco_points - reward.required_points,
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: profile.id,
      title: '🎉 Reward Claimed!',
      message: `You redeemed ${reward.title}. Voucher code: ${code}`,
      type: 'reward_claimed',
      is_read: false,
      action_url: '/resident/rewards',
      created_at: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `Successfully redeemed! Voucher Code: ${code}`,
    };
  };

  // Unlock Achievement
  const unlockAchievement = (code: string) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.code === code ? { ...ach, is_unlocked: true, unlocked_at: 'Just now' } : ach
      )
    );
  };

  // Join Challenge
  const joinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) =>
        ch.id === challengeId
          ? {
              ...ch,
              is_joined: true,
              participants_count: (ch.participants_count || 0) + 1,
            }
          : ch
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: profile.id,
      title: '🏆 Challenge Joined',
      message: 'You have joined the community challenge! Keep verifying daily to win rewards.',
      type: 'derby_update',
      is_read: false,
      action_url: '/resident/challenges',
      created_at: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Spot check triggers
  const triggerSpotCheck = () => {
    setIsSpotCheckActive(true);
    setIsSpotCheckModalOpen(true);
  };

  const dismissSpotCheck = () => {
    setIsSpotCheckModalOpen(false);
  };

  // Notification management
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        activeRole,
        setActiveRole,
        loginUser,
        society,
        categories,
        selectedCategory,
        setSelectedCategory,
        pendingImage,
        setPendingImage,
        lastVerification,
        setLastVerification,
        verifications,
        addVerification,
        rewards,
        redemptions,
        redeemReward,
        achievements,
        unlockAchievement,
        challenges,
        joinChallenge,
        isSpotCheckActive,
        triggerSpotCheck,
        dismissSpotCheck,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        educationalItems,
        leaderboardResidents,
        residents,
        spotChecks,
        isSpotCheckModalOpen,
        setIsSpotCheckModalOpen,
        isRewardModalOpen,
        setIsRewardModalOpen,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
