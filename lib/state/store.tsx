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
} from '@/types';
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
  const clean = namePart.replace(/[0-9_.]+/g, ' ').trim();
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
    isContaminated?: boolean
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
    localStorage.setItem('ecoloop-theme', mode);

    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
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
            const updated: Profile = {
              ...INITIAL_PROFILE,
              id: profileData.id,
              email: profileData.email || userEmail || '',
              full_name: profileData.full_name || formatNameFromEmail(userEmail || ''),
              role: profileData.role || 'resident',
              society_id: profileData.society_id || 'gvr-tower-b',
              building: profileData.building || 'Tower B (Orchid)',
              flat_number: profileData.flat_number || 'Apt 402B',
              avatar_url: profileData.avatar_url || '/deepak-avatar.png',
              eco_points: profileData.eco_points ?? 50,
              current_streak: profileData.current_streak ?? 0,
              consistency_score: profileData.consistency_score ? Number(profileData.consistency_score) : 80.0,
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
              eco_points: 50,
              current_streak: 0,
              consistency_score: 80.0,
              total_verifications: 0,
              tier_level: 1,
              is_active: true,
            };

            await supabase.from('profiles').insert({
              id: userId,
              email: userEmail || '',
              full_name: newProfileData.full_name,
              role: 'resident',
              society_id: 'gvr-tower-b',
              building: 'Tower B (Orchid)',
              flat_number: 'Apt 402B',
              avatar_url: '/deepak-avatar.png',
              eco_points: 50,
              current_streak: 0,
              consistency_score: 80.0,
              total_verifications: 0,
              tier_level: 1,
              is_active: true,
            });

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
    isContaminated = false
  ): Verification => {
    const category = categories.find((c) => c.slug === catSlug) || categories[0];
    const points = isContaminated ? 5 : isSpotCheck ? 20 : category.base_points;
    const bonus = isContaminated ? 0 : 5;
    const totalAwarded = points + bonus;

    const newVerification: Verification = {
      id: `v-${Date.now()}`,
      user_id: profile.id,
      category_id: category.id,
      category_slug: catSlug,
      status: isContaminated ? 'needs_attention' : 'verified',
      points_awarded: points,
      clean_bin_bonus: bonus,
      streak_multiplier: isSpotCheck ? 2.0 : 1.2,
      ai_detected_category: isContaminated ? 'Contaminant Flagged' : category.name,
      ai_confidence: isContaminated ? 89.2 : 95.8,
      is_spot_check: isSpotCheck,
      image_url: imageUrl || (catSlug === 'wet' ? '/stitch_ecoloop_gamified_waste_segregation/ecoloop_ai_verification_results/screen.png' : undefined),
      ai_feedback: isContaminated
        ? 'Almost there! We spotted a dry recyclable material inside your organic bin. Removed and re-scanned.'
        : `Clean ${category.name} validated by EcoLoop AI. +${totalAwarded} points credited!`,
      verified_at: 'Just now',
      created_at: new Date().toISOString(),
    };

    setVerifications((prev) => [newVerification, ...prev]);
    setLastVerification(newVerification);

    // Update Profile points & streak
    setProfile((prev) => {
      const nextStreak = isContaminated ? prev.current_streak : prev.current_streak + 1;
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

    // Update Leaderboard
    setLeaderboardResidents((prev) =>
      prev.map((r) =>
        r.id === profile.id
          ? {
              ...r,
              eco_points: r.eco_points + totalAwarded,
              current_streak: isContaminated ? r.current_streak : r.current_streak + 1,
            }
          : r
      )
    );

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: profile.id,
      title: isContaminated ? 'Correction Verified (+5 pts)' : `Waste Verified (+${totalAwarded} pts)`,
      message: isContaminated
        ? 'Contaminant was removed and verified. Great habit recovery!'
        : `${category.name} verified cleanly with 95.8% accuracy.`,
      type: 'verification_success',
      is_read: false,
      action_url: '/resident/history',
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
