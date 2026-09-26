export type CreatorCategory =
  | 'Fashion'
  | 'Beauty'
  | 'Lifestyle'
  | 'Fitness'
  | 'Gaming'
  | 'Photography'
  | 'UGC'
  | 'Music'
  | 'Travel'
  | 'Technology'
  | 'Food'
  | 'Education'
  | 'Other';

export type CollaborationStatus =
  | 'Inquiry'
  | 'Negotiating'
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface SocialAccount {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';
  username: string;
  followers: number;
  engagementRate?: number;
  url: string;
}

export interface CreatorService {
  id: string;
  title: string;
  deliverables: string;
  startingPrice: number;
  currency: string;
  turnaroundDays: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: CreatorCategory;
  imageUrl: string;
  brand?: string;
  views?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  date: string;
  externalUrl?: string;
}

export interface CollaborationRecord {
  id: string;
  brandName: string;
  campaignName: string;
  contactName: string;
  contactEmail: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Multi-platform' | 'UGC';
  campaignType: 'Sponsored Reel' | 'Dedicated Video' | 'Photo Series' | 'UGC Package' | 'Brand Ambassador';
  paymentAmount: number;
  currency: string;
  deadline: string;
  status: CollaborationStatus;
  notes?: string;
  deliverables?: string[];
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  category: CreatorCategory;
  location: string;
  verified: boolean;
  featuredRate: number;
  completionPercentage: number;
  socials: SocialAccount[];
  services: CreatorService[];
  portfolio: PortfolioItem[];
  recentCollaborations: {
    brandName: string;
    campaign: string;
    date: string;
    highlightMetric?: string;
  }[];
  audienceDemographics: {
    topLocation: string;
    genderRatio: string;
    ageRange: string;
  };
}

export interface AnalyticsSummary {
  profileViewsMonthly: number;
  profileViewsGrowth: number;
  mediaKitDownloads: number;
  activeDealsCount: number;
  inquiriesCount: number;
  pipelineValue: number;
}

export interface DbProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  category: CreatorCategory | null;
  categories?: CreatorCategory[];
  location: string | null;
  is_public: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSocialAccount {
  id: string;
  profile_id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'website';
  username?: string;
  url: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbService {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  starting_price: number | null;
  currency: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbNotification {
  id: string;
  profile_id: string;
  type: 'welcome' | 'profile_incomplete' | 'profile_updated' | 'system' | 'tip';
  title: string;
  message: string;
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

export interface OnboardingData {
  fullName: string;
  username: string;
  categories: CreatorCategory[];
  instagram: string;
  youtube: string;
  tiktok: string;
  website: string;
  bio: string;
  location: string;
  avatarUrl: string | null;
  avatarFile?: File | null;
}

export type AuthStateStatus = 'loading' | 'authenticated' | 'unauthenticated';
