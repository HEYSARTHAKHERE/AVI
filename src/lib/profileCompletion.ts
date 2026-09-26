import { DbProfile, DbSocialAccount, CreatorCategory } from '../types';

export interface CompletionBreakdown {
  basicInfo: boolean;
  categories: boolean;
  socials: boolean;
  bio: boolean;
  avatar: boolean;
  location: boolean;
  portfolio: boolean;
  score: number;
}

/**
 * Calculates real creator profile completion based on actual database attributes.
 *
 * Scoring model:
 * - Basic Information (Full Name + Valid Username): 20%
 * - Creator Categories (>= 1 selected): 15%
 * - Social Accounts (>= 1 valid connected link): 15%
 * - Bio (Detailed bio >= 10 characters): 15%
 * - Profile Photo (Avatar uploaded): 15%
 * - Location (City / Region specified): 10%
 * - Portfolio (Portfolio campaigns added): 10% (Phase 5)
 *
 * Total maximum in Phase 3: 90% (100% when portfolio is added in Phase 5)
 */
export function calculateProfileCompletion(
  profile: Partial<DbProfile> | null,
  socialsCount: number = 0,
  portfolioCount: number = 0
): CompletionBreakdown {
  if (!profile) {
    return {
      basicInfo: false,
      categories: false,
      socials: false,
      bio: false,
      avatar: false,
      location: false,
      portfolio: false,
      score: 0,
    };
  }

  const basicInfo = Boolean(
    profile.full_name &&
    profile.full_name.trim().length >= 2 &&
    profile.username &&
    profile.username.trim().length >= 3
  );

  const categories = Boolean(
    (profile.categories && profile.categories.length > 0) ||
    Boolean(profile.category)
  );

  const socials = socialsCount > 0;

  const bio = Boolean(profile.bio && profile.bio.trim().length >= 10);

  const avatar = Boolean(profile.avatar_url && profile.avatar_url.trim().length > 0);

  const location = Boolean(profile.location && profile.location.trim().length > 0);

  const portfolio = portfolioCount > 0;

  let score = 0;
  if (basicInfo) score += 20;
  if (categories) score += 15;
  if (socials) score += 15;
  if (bio) score += 15;
  if (avatar) score += 15;
  if (location) score += 10;
  if (portfolio) score += 10;

  return {
    basicInfo,
    categories,
    socials,
    bio,
    avatar,
    location,
    portfolio,
    score: Math.min(100, score),
  };
}
