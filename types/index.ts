export type UserRole = 'resident' | 'admin' | 'society_admin' | 'municipal_admin';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Society {
  id: string;
  name: string;
  ward: string;
  zone: string;
  license_number?: string;
  total_units: number;
  active_units: number;
  compliance_rate: number;
  consistency_index: number;
  landfill_diversion_tons: number;
  total_eco_currency: number;
  spot_check_interval_days: number;
}

export interface Profile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  role: UserRole;
  society_id?: string;
  building?: string;
  flat_number?: string;
  avatar_url?: string;
  eco_points: number;
  current_streak: number;
  consistency_score: number;
  total_verifications: number;
  tier_level: number;
  is_active: boolean;
  preferences?: {
    theme?: ThemeMode;
    sound?: boolean;
    pushNotifications?: boolean;
  };
  privacy_settings?: {
    photoVerification: boolean;
    continuousSurveillance: boolean;
    locationTracking: boolean;
    dataSharing: string;
    photoRetentionDays: number;
  };
}

export interface AdminResident {
  id: string;
  full_name: string;
  flat_number: string;
  tower: string;
  accuracy_rate: number;
  consistency_index: number;
  streak_days: number;
  eco_points: number;
  badge_status: string;
  avatar_url?: string;
}

export interface WasteCategory {
  id: string;
  slug: 'wet' | 'dry' | 'special';
  name: string;
  bin_name: string;
  bin_color: string;
  description: string;
  base_points: number;
  badge_label?: string;
  examples: string[];
}

export type VerificationStatus = 'pending' | 'verified' | 'needs_attention' | 'rejected';

export interface Verification {
  id: string;
  user_id: string;
  society_id?: string;
  category_id: string;
  category_slug?: 'wet' | 'dry' | 'special';
  waste_category?: string;
  item_detected?: string;
  image_url?: string;
  image_storage_path?: string;
  is_spot_check: boolean;
  ai_detected_category?: string;
  ai_confidence?: number;
  confidence?: number;
  status: VerificationStatus;
  points_awarded: number;
  clean_bin_bonus: number;
  streak_multiplier: number;
  ai_feedback?: string;
  contaminant_detected?: string;
  correction_prompt?: string;
  verified_at?: string;
  created_at: string;
}

export interface SpotCheck {
  id: string;
  user_id: string;
  society_id: string;
  verification_id?: string;
  scheduled_date: string;
  deadline_at?: string;
  status: 'requested' | 'completed' | 'missed' | 'waived';
  bonus_multiplier: number;
  points_awarded?: number;
  result?: {
    verified?: boolean;
    accuracy?: number;
  };
  created_at: string;
  completed_at?: string;
}

export interface Reward {
  id: string;
  society_id?: string;
  title: string;
  description: string;
  partner_name?: string;
  required_points: number;
  stock_quantity: number;
  points_cost?: number;
  stock?: number;
  category?: string;
  icon_name?: string;
  expiry_days?: number;
  image_url?: string;
  badge_type?: string;
  is_active: boolean;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  reward_title?: string;
  points_spent: number;
  voucher_code: string;
  status: 'redeemed' | 'used' | 'expired';
  redeemed_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  target_count: number;
  category: string;
  points_reward: number;
  is_unlocked?: boolean;
  progress?: number;
  unlocked_at?: string;
}

export interface Challenge {
  id: string;
  society_id?: string;
  title: string;
  description: string;
  target_metric?: string;
  target_type?: string;
  target_value: number;
  current_value?: number;
  community_reward?: string;
  points_reward?: number;
  starts_at?: string;
  ends_at?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_joined?: boolean;
  participants_count?: number;
  participant_count?: number;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface EducationalItem {
  id: string;
  item_name: string;
  category_slug: 'wet' | 'dry' | 'special';
  assigned_bin: string;
  golden_rule: string;
  split_instructions?: string;
  hazard_warning?: string;
  search_keywords: string[];
  icon?: string;
  image_url?: string;
}

export interface AIVerificationResponse {
  detectedCategory: 'wet' | 'dry' | 'special' | 'unrecognized';
  confidence: number;
  status: 'verified' | 'needs_attention';
  feedback: string;
  contaminant?: string;
  correctionPrompt?: string;
  suggestedAction?: string;
}
