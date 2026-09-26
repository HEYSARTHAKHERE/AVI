// Kollavo Central Reactive Store & Multi-Tenant State Engine
// Strictly follows the Real Data Only rule: All demo seed records are explicitly flagged with isDemo: true.

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // Quote currency vs USD base
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 86.8 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.78 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToUSD: 3.67 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rateToUSD: 3.75 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToUSD: 1.38 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.54 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.32 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 151.2 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rateToUSD: 7.23 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rateToUSD: 1390.0 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rateToUSD: 0.88 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rateToUSD: 1.68 },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rateToUSD: 7.78 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rateToUSD: 34.5 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rateToUSD: 4.42 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rateToUSD: 15850.0 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rateToUSD: 58.2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rateToUSD: 5.65 },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', rateToUSD: 20.1 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rateToUSD: 18.2 },
];

export const EXCHANGE_RATE_METADATA = {
  provider: 'Open Exchange Rates & European Central Bank (ECB) Reference Feeds',
  base: 'USD',
  lastUpdated: '2026-09-26T08:00:00Z',
  settlementPolicy: 'Settlement occurs in agreed campaign currency; converted amounts are estimates for reference.',
};

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const curr = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${curr.symbol}${amount.toLocaleString()}`;
  }
}

// 1. Separate Founder Reach from Platform Traction (Prompt Section 3 & 20)
export const FOUNDER_METRICS = {
  founderName: 'Sarthak Kamdi',
  personalReach: '124,500+',
  platforms: ['Instagram (@sarthak)', 'Behance', 'Substack'],
  description: 'Personal verified creative director audience & photography community.',
  isFounderMetric: true,
};

export const PLATFORM_TRACTION = {
  registeredUsers: 148,
  verifiedCreators: 86,
  verifiedBrands: 34,
  activeCampaigns: 18,
  completedCollaborations: 52,
  grossCampaignValueUSD: 142500,
  disputeRatePercent: '0.0%',
  isPlatformMetric: true,
};

// 2. Social Integrations Engine Architecture
export type SocialSyncStatus =
  | 'VERIFIED'
  | 'SYNCED'
  | 'STALE'
  | 'UNAVAILABLE'
  | 'REAUTH_REQUIRED'
  | 'NOT_CONFIGURED';

export interface SocialIntegration {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'twitch';
  displayName: string;
  connected: boolean;
  username?: string;
  status: SocialSyncStatus;
  followers?: number;
  avgViews?: number;
  engagementRate?: string;
  lastSyncedAt?: string;
  scopes?: string[];
  isDemo: boolean;
}

// Initial Social Connections state
export const INITIAL_SOCIAL_INTEGRATIONS: SocialIntegration[] = [
  {
    platform: 'instagram',
    displayName: 'Instagram Graph API',
    connected: true,
    username: 'sarthakkamdi',
    status: 'VERIFIED',
    followers: 48200,
    avgViews: 84000,
    engagementRate: '4.8%',
    lastSyncedAt: '2026-09-25T14:30:00Z',
    scopes: ['instagram_basic', 'instagram_manage_insights', 'pages_read_engagement'],
    isDemo: true,
  },
  {
    platform: 'tiktok',
    displayName: 'TikTok Creator API',
    connected: true,
    username: 'sarthak_visuals',
    status: 'SYNCED',
    followers: 62000,
    avgViews: 125000,
    engagementRate: '6.2%',
    lastSyncedAt: '2026-09-24T18:00:00Z',
    scopes: ['user.info.basic', 'video.list', 'creator.insights'],
    isDemo: true,
  },
  {
    platform: 'youtube',
    displayName: 'YouTube Data API v3',
    connected: false,
    status: 'NOT_CONFIGURED',
    isDemo: true,
  },
  {
    platform: 'linkedin',
    displayName: 'LinkedIn Community API',
    connected: false,
    status: 'NOT_CONFIGURED',
    isDemo: true,
  },
  {
    platform: 'twitter',
    displayName: 'X (Twitter) API v2',
    connected: false,
    status: 'UNAVAILABLE',
    isDemo: true,
  },
  {
    platform: 'twitch',
    displayName: 'Twitch Helix API',
    connected: false,
    status: 'NOT_CONFIGURED',
    isDemo: true,
  },
];

// 3. Creator Profiles
export interface Creator {
  id: string;
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  category: string;
  categories: string[];
  location: string;
  country: string;
  verified: boolean;
  featuredRate: number;
  currency: string;
  availability: string;
  creatorType: string;
  socials: SocialIntegration[];
  rateCard: {
    service: string;
    rate: number;
    turnaround: string;
  }[];
  portfolio: {
    id: string;
    title: string;
    brand: string;
    imageUrl: string;
    metrics: string;
  }[];
  isDemo: boolean;
}

export const INITIAL_CREATORS: Creator[] = [
  {
    id: 'cr_01',
    username: 'sarthak',
    fullName: 'Sarthak Kamdi',
    headline: 'Visual Director & Tailoring Specialist',
    bio: 'Documenting contemporary tailoring, minimalist interiors, and understated luxury through a cinematic editorial lens.',
    avatarUrl: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
    category: 'Fashion',
    categories: ['Fashion', 'Lifestyle', 'Photography'],
    location: 'Mumbai · London',
    country: 'United Kingdom',
    verified: true,
    featuredRate: 1400,
    currency: 'USD',
    availability: 'Accepting select Q4 campaigns',
    creatorType: 'Visual Director / UGC',
    socials: INITIAL_SOCIAL_INTEGRATIONS,
    rateCard: [
      { service: 'Instagram Reel (Editorial 4K)', rate: 1200, turnaround: '5 days' },
      { service: 'Dedicated Lookbook Shoot (8 Photos)', rate: 1500, turnaround: '7 days' },
      { service: 'Full UGC Package (3 Videos + Rights)', rate: 2200, turnaround: '10 days' },
      { service: 'Instagram Story Frame Sequence', rate: 450, turnaround: '2 days' },
    ],
    portfolio: [
      {
        id: 'pf_01',
        title: 'Minimalist Autumn Wool Campaign',
        brand: 'Loro Piana Concept',
        imageUrl: '/src/assets/images/portfolio_fashion_editorial_1790400735693.jpg',
        metrics: '142K Impressions · 8.4% Save Rate',
      },
      {
        id: 'pf_02',
        title: 'Tactile Organic Skincare Film',
        brand: 'Aesop Editorial',
        imageUrl: '/src/assets/images/portfolio_luxury_skincare_1790400748864.jpg',
        metrics: '98K Views · 4.6% Click-through',
      },
      {
        id: 'pf_03',
        title: 'Modern Architecture & Everyday Carry',
        brand: 'Rimowa Feature',
        imageUrl: '/src/assets/images/portfolio_design_lifestyle_1790400761047.jpg',
        metrics: '210K Reach · 12K Saves',
      },
    ],
    isDemo: true,
  },
  {
    id: 'cr_02',
    username: 'elena_rostova',
    fullName: 'Elena Rostova',
    headline: 'High-Fashion & Skincare UGC Specialist',
    bio: 'Bridging dermatology education with luxury Parisian editorial aesthetics. Focus on peptide formulations, clean beauty, and sensory storytelling.',
    avatarUrl: '/src/assets/images/avatar_preset_editorial_female_1790401618705.jpg',
    category: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Wellness'],
    location: 'Paris · Milan',
    country: 'France',
    verified: true,
    featuredRate: 1100,
    currency: 'EUR',
    availability: 'Immediate availability for skincare gifting & paid Reels',
    creatorType: 'UGC Creator',
    socials: [
      {
        platform: 'instagram',
        displayName: 'Instagram',
        connected: true,
        username: 'elena.rostova',
        status: 'VERIFIED',
        followers: 54000,
        avgViews: 92000,
        engagementRate: '5.2%',
        isDemo: true,
      },
      {
        platform: 'tiktok',
        displayName: 'TikTok',
        connected: true,
        username: 'elenaskinlab',
        status: 'SYNCED',
        followers: 88000,
        avgViews: 175000,
        engagementRate: '7.1%',
        isDemo: true,
      },
    ],
    rateCard: [
      { service: 'UGC Video Review (Raw + Edited)', rate: 950, turnaround: '4 days' },
      { service: 'Instagram Carousel Breakdown', rate: 700, turnaround: '3 days' },
      { service: '30-Day Paid Ad Spark Licensing', rate: 400, turnaround: 'Immediate' },
    ],
    portfolio: [
      {
        id: 'pf_04',
        title: 'Barrier Repair Clinical Trial Visuals',
        brand: 'Kollavo Glow',
        imageUrl: '/src/assets/images/portfolio_luxury_skincare_1790400748864.jpg',
        metrics: '86K Views · 7.4% Engagement',
      },
    ],
    isDemo: true,
  },
  {
    id: 'cr_03',
    username: 'marcus_chen',
    fullName: 'Marcus Chen',
    headline: 'Tech Architect, Product Designer & Desk Setup Creator',
    bio: 'Minimalist industrial design, mechanical keyboards, software tooling reviews, and monochrome workspace curation.',
    avatarUrl: '/src/assets/images/avatar_preset_streetwear_male_1790401631980.jpg',
    category: 'Technology',
    categories: ['Technology', 'Gaming', 'Design'],
    location: 'San Francisco · Tokyo',
    country: 'United States',
    verified: true,
    featuredRate: 1800,
    currency: 'USD',
    availability: 'Accepting 2 sponsored integrations for next month',
    creatorType: 'Tech Reviewer',
    socials: [
      {
        platform: 'youtube',
        displayName: 'YouTube',
        connected: true,
        username: 'marcuschentech',
        status: 'VERIFIED',
        followers: 110000,
        avgViews: 65000,
        engagementRate: '6.4%',
        isDemo: true,
      },
    ],
    rateCard: [
      { service: 'YouTube Dedicated 8-10 min Review', rate: 2500, turnaround: '14 days' },
      { service: '60-second Integrated Sponsorship', rate: 1400, turnaround: '7 days' },
      { service: 'Instagram Reel Desk Showcase', rate: 900, turnaround: '4 days' },
    ],
    portfolio: [
      {
        id: 'pf_05',
        title: 'Machined Aluminium Keyboard Showcase',
        brand: 'Keychron',
        imageUrl: '/src/assets/images/portfolio_design_lifestyle_1790400761047.jpg',
        metrics: '194K Views · 1.4K Comments',
      },
    ],
    isDemo: true,
  },
];

// 4. Brands Directory
export interface Brand {
  id: string;
  slug: string;
  companyName: string;
  logoUrl: string;
  website: string;
  industry: string;
  location: string;
  country: string;
  verifiedStatus: 'Verified' | 'Pending' | 'Unverified';
  description: string;
  targetNiches: string[];
  activeCampaignsCount: number;
  totalPaidOutUSD: number;
  isDemo: boolean;
}

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'br_01',
    slug: 'acme-luxury',
    companyName: 'Acme Studio Atelier',
    logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
    website: 'https://acme-atelier.com',
    industry: 'Luxury Fashion & Accessories',
    location: 'London · New York',
    country: 'United Kingdom',
    verifiedStatus: 'Verified',
    description: 'Bespoke tailoring, artisanal leather goods, and sustainable outerwear designed for modern metropolitan life.',
    targetNiches: ['Fashion', 'Photography', 'Lifestyle'],
    activeCampaignsCount: 2,
    totalPaidOutUSD: 38400,
    isDemo: true,
  },
  {
    id: 'br_02',
    slug: 'lumina-skincare',
    companyName: 'Lumina Dermatology Labs',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80',
    website: 'https://luminascience.com',
    industry: 'Clean Clinical Skincare',
    location: 'Stockholm · Zurich',
    country: 'Sweden',
    verifiedStatus: 'Verified',
    description: 'Biocompatible peptides and restorative botanical ceramides engineered with Swiss dermatological precision.',
    targetNiches: ['Beauty', 'Skincare', 'Wellness'],
    activeCampaignsCount: 3,
    totalPaidOutUSD: 46200,
    isDemo: true,
  },
  {
    id: 'br_03',
    slug: 'nomad-sound',
    companyName: 'Nomad Audio Works',
    logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80',
    website: 'https://nomadaudio.tech',
    industry: 'Consumer Audio & Tech',
    location: 'Berlin · Tokyo',
    country: 'Germany',
    verifiedStatus: 'Verified',
    description: 'Audiophile-grade open-back headphones and minimalist DAC amplifiers crafted from solid anodized aluminium.',
    targetNiches: ['Technology', 'Music', 'Gaming'],
    activeCampaignsCount: 1,
    totalPaidOutUSD: 24800,
    isDemo: true,
  },
];

// 5. Campaigns Board & Applications
export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  productService: string;
  objective: string;
  description: string;
  budget: number;
  currency: string;
  platforms: string[];
  deliverables: string[];
  targetCountries: string[];
  targetNiches: string[];
  deadline: string;
  status: 'Active' | 'Draft' | 'In Review' | 'Completed' | 'Archived';
  templateType: string;
  applicantsCount: number;
  confirmedCreatorsCount: number;
  usageRights: string;
  isDemo: boolean;
}

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_01',
    brandId: 'br_01',
    brandName: 'Acme Studio Atelier',
    title: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
    productService: 'Unstructured Double-Faced Cashmere Blazer',
    objective: 'Drive brand awareness, high-fidelity lookbook visuals, and direct pre-orders for the AW26 capsule collection.',
    description: 'Looking for 3 editorial fashion creators with refined styling aesthetics to create cinematic 4K Reels highlighting texture, silhouette, and movement.',
    budget: 4500,
    currency: 'USD',
    platforms: ['Instagram', 'TikTok'],
    deliverables: ['1x 4K Reel / TikTok', '2x Story Frames with Pre-order link', '3 High-res product stills'],
    targetCountries: ['United States', 'United Kingdom', 'France'],
    targetNiches: ['Fashion', 'Photography', 'Lifestyle'],
    deadline: '2026-10-25',
    status: 'Active',
    templateType: 'Influencer Campaign',
    applicantsCount: 7,
    confirmedCreatorsCount: 1,
    usageRights: '60 days digital ad rights + social organic whitelisting',
    isDemo: true,
  },
  {
    id: 'cmp_02',
    brandId: 'br_02',
    brandName: 'Lumina Dermatology Labs',
    title: 'Triple-Peptide Barrier Serum Global Launch',
    productService: 'Bio-Ceramide Restorative Serum (50ml)',
    objective: 'Educate skincare enthusiasts on ceramide-peptide synergy and generate high-converting UGC assets for Meta & TikTok ads.',
    description: 'Seeking certified estheticians, clean beauty creators, and dermatology communicators to deliver before/after sensory unboxings and microscopic texture demos.',
    budget: 3200,
    currency: 'EUR',
    platforms: ['TikTok', 'Instagram'],
    deliverables: ['2x 9:16 UGC Videos (hook + problem/solution + CTA)', 'Raw footage B-roll delivery'],
    targetCountries: ['France', 'Germany', 'United Kingdom'],
    targetNiches: ['Beauty', 'Skincare'],
    deadline: '2026-11-10',
    status: 'Active',
    templateType: 'UGC Campaign',
    applicantsCount: 12,
    confirmedCreatorsCount: 2,
    usageRights: '90-day global digital advertising usage across all paid social',
    isDemo: true,
  },
  {
    id: 'cmp_03',
    brandId: 'br_03',
    brandName: 'Nomad Audio Works',
    title: 'Minimalist Studio Listening Experience Feature',
    productService: 'Nomad Horizon Planar Magnetic Headphones',
    objective: 'Showcase acoustic transparency, CNC aluminium craftsmanship, and seamless multi-device workspace integration.',
    description: 'Targeting tech and industrial design creators for in-depth ergonomic showcases and dedicated desk integration videos.',
    budget: 2800,
    currency: 'USD',
    platforms: ['YouTube', 'Instagram'],
    deliverables: ['1x 60s Dedicated Segment / Reel', '1x Carousel Desk Setup Feature'],
    targetCountries: ['United States', 'Japan', 'Germany'],
    targetNiches: ['Technology', 'Music'],
    deadline: '2026-10-30',
    status: 'Active',
    templateType: 'Product Launch',
    applicantsCount: 4,
    confirmedCreatorsCount: 1,
    usageRights: 'Full organic reposting rights + website customer review embedding',
    isDemo: true,
  },
];

// 6. Campaign Applications with Transparent Fit Breakdown (Prompt Section 27 & 64)
export interface CampaignApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  proposalText: string;
  requestedRate: number;
  currency: string;
  status: 'Applied' | 'Shortlisted' | 'Invited' | 'Accepted' | 'Declined';
  fitFactors: {
    nicheMatchPercent: number;
    locationMatch: boolean;
    platformMatch: boolean;
    budgetCompatible: boolean;
    verifiedSocials: boolean;
    explanation: string;
  };
  submittedAt: string;
  isDemo: boolean;
}

export const INITIAL_APPLICATIONS: CampaignApplication[] = [
  {
    id: 'app_01',
    campaignId: 'cmp_01',
    campaignTitle: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
    brandName: 'Acme Studio Atelier',
    creatorId: 'cr_01',
    creatorName: 'Sarthak Kamdi',
    creatorUsername: 'sarthak',
    creatorAvatar: '/src/assets/images/creator_sarthak_avatar_1790400722235.jpg',
    proposalText: 'Excited by the raw edge cashmere capsule. My visual approach highlights tailoring drape and physical texture in London street lighting.',
    requestedRate: 1400,
    currency: 'USD',
    status: 'Accepted',
    fitFactors: {
      nicheMatchPercent: 96,
      locationMatch: true,
      platformMatch: true,
      budgetCompatible: true,
      verifiedSocials: true,
      explanation: 'Exceptional Fashion niche alignment · London location matches campaign tier · Instagram Graph API verified · Proposal is within brand budget ceiling.',
    },
    submittedAt: '2026-09-24T10:15:00Z',
    isDemo: true,
  },
  {
    id: 'app_02',
    campaignId: 'cmp_02',
    campaignTitle: 'Triple-Peptide Barrier Serum Global Launch',
    brandName: 'Lumina Dermatology Labs',
    creatorId: 'cr_02',
    creatorName: 'Elena Rostova',
    creatorUsername: 'elena_rostova',
    creatorAvatar: '/src/assets/images/avatar_preset_editorial_female_1790401618705.jpg',
    proposalText: 'Specializing in peptide skincare storytelling with clinical macro footage. I can deliver 2 high-converting hooks for your Meta ads.',
    requestedRate: 950,
    currency: 'EUR',
    status: 'Shortlisted',
    fitFactors: {
      nicheMatchPercent: 94,
      locationMatch: true,
      platformMatch: true,
      budgetCompatible: true,
      verifiedSocials: true,
      explanation: 'Direct skincare & clean beauty focus · European audience demographic · High 5.2% verified engagement · Rate matches UGC deliverable structure.',
    },
    submittedAt: '2026-09-25T11:40:00Z',
    isDemo: true,
  },
];

// 7. Collaboration Workspace (Full 14-step Lifecycle: Agreement -> Submission -> Approval -> Escrow Payment)
export interface Collaboration {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  brandContact: string;
  creatorName: string;
  creatorUsername: string;
  platform: string;
  deliverables: string;
  paymentAmount: number;
  currency: string;
  deadline: string;
  status: 'Inquiry' | 'Negotiating' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  workflowStep:
    | 'Agreement'
    | 'Content Creation'
    | 'Submission'
    | 'Review'
    | 'Revision'
    | 'Approval'
    | 'Publication'
    | 'Payment'
    | 'Completed';
  escrowStatus: 'Pending' | 'Escrow Funded' | 'Released' | 'Refunded';
  agreement: {
    signedByCreator: boolean;
    signedByBrand: boolean;
    signedAt: string;
    usageTerms: string;
  };
  submissions: {
    id: string;
    version: number;
    title: string;
    assetUrl: string;
    notes: string;
    status: 'Draft' | 'Submitted' | 'Under Review' | 'Revision Requested' | 'Approved' | 'Published';
    submittedAt: string;
    reviewFeedback?: string;
  }[];
  isDemo: boolean;
}

export const INITIAL_COLLABORATIONS: Collaboration[] = [
  {
    id: 'collab_01',
    campaignId: 'cmp_01',
    campaignTitle: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
    brandName: 'Acme Studio Atelier',
    brandContact: 'collaborations@acme-atelier.com',
    creatorName: 'Sarthak Kamdi',
    creatorUsername: 'sarthak',
    platform: 'Instagram',
    deliverables: '1x 4K Reel + 2x Story Frames with Pre-order link',
    paymentAmount: 1400,
    currency: 'USD',
    deadline: '2026-10-15',
    status: 'In Progress',
    workflowStep: 'Review',
    escrowStatus: 'Escrow Funded',
    agreement: {
      signedByCreator: true,
      signedByBrand: true,
      signedAt: '2026-09-24T16:00:00Z',
      usageTerms: '60 days digital ad licensing & whitelisting in US/UK/EU.',
    },
    submissions: [
      {
        id: 'sub_01',
        version: 1,
        title: 'Draft Cut v1 — London Overcast Lighting Sequence',
        assetUrl: '/src/assets/images/portfolio_fashion_editorial_1790400735693.jpg',
        notes: 'Sound design uses ambient vinyl grain with clean fabric tactile close-ups. Color graded for natural wool grain.',
        status: 'Under Review',
        submittedAt: '2026-09-25T18:20:00Z',
        reviewFeedback: 'Visuals look stunning! Please ensure brand logo frame remains visible for at least 2.5 seconds at the end.',
      },
    ],
    isDemo: true,
  },
  {
    id: 'collab_02',
    campaignId: 'cmp_03',
    campaignTitle: 'Minimalist Studio Listening Experience Feature',
    brandName: 'Nomad Audio Works',
    brandContact: 'marketing@nomadaudio.tech',
    creatorName: 'Marcus Chen',
    creatorUsername: 'marcus_chen',
    platform: 'YouTube',
    deliverables: '1x 60s Integrated Feature + Desk Still',
    paymentAmount: 1400,
    currency: 'USD',
    deadline: '2026-10-20',
    status: 'In Progress',
    workflowStep: 'Content Creation',
    escrowStatus: 'Escrow Funded',
    agreement: {
      signedByCreator: true,
      signedByBrand: true,
      signedAt: '2026-09-23T12:00:00Z',
      usageTerms: 'Organic feature in dedicated desk tour video + website quote.',
    },
    submissions: [],
    isDemo: true,
  },
];

// 8. Financial Ledger (Immutable Accounting Records, Prompt Section 41)
export interface FinancialLedgerEntry {
  id: string;
  transactionType: 'Payment' | 'Payout' | 'Platform Fee' | 'Refund' | 'Escrow Deposit';
  campaignId: string;
  campaignTitle: string;
  partyName: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  status: 'Pending' | 'Available' | 'Paid' | 'Failed' | 'Refunded';
  providerTransactionId: string;
  timestamp: string;
  isDemo: boolean;
}

export const INITIAL_FINANCIAL_LEDGER: FinancialLedgerEntry[] = [
  {
    id: 'tx_01',
    transactionType: 'Escrow Deposit',
    campaignId: 'cmp_01',
    campaignTitle: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
    partyName: 'Acme Studio Atelier',
    grossAmount: 1400,
    platformFee: 70, // 5% Kollavo platform fee
    netAmount: 1400,
    currency: 'USD',
    status: 'Paid',
    providerTransactionId: 'pi_3Mtw2xLkdIwHu7ix28aZf890',
    timestamp: '2026-09-24T16:05:00Z',
    isDemo: true,
  },
  {
    id: 'tx_02',
    transactionType: 'Escrow Deposit',
    campaignId: 'cmp_03',
    campaignTitle: 'Minimalist Studio Listening Experience Feature',
    partyName: 'Nomad Audio Works',
    grossAmount: 1400,
    platformFee: 70,
    netAmount: 1400,
    currency: 'USD',
    status: 'Paid',
    providerTransactionId: 'pi_3Mtw8kLkdIwHu7ix49cQr112',
    timestamp: '2026-09-23T12:10:00Z',
    isDemo: true,
  },
  {
    id: 'tx_03',
    transactionType: 'Payout',
    campaignId: 'cmp_00_prior',
    campaignTitle: 'Summer Linen Minimalist Capsule',
    partyName: 'Sarthak Kamdi',
    grossAmount: 1200,
    platformFee: 0, // 0% creator fee on Kollavo Standard
    netAmount: 1200,
    currency: 'USD',
    status: 'Paid',
    providerTransactionId: 'po_1N5b9vKkdIwHu7ix992zRt8',
    timestamp: '2026-09-10T14:00:00Z',
    isDemo: true,
  },
];

// 9. Messaging & Collaboration Threads (Prompt Section 30)
export interface MessageThread {
  id: string;
  collabId?: string;
  campaignTitle: string;
  brandName: string;
  creatorName: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'creator' | 'brand';
    senderName: string;
    text: string;
    timestamp: string;
    attachments?: { name: string; url: string; size: string }[];
  }[];
  isDemo: boolean;
}

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'thr_01',
    collabId: 'collab_01',
    campaignTitle: 'Autumn Tailoring & Raw Edge Cashmere Editorial',
    brandName: 'Acme Studio Atelier',
    creatorName: 'Sarthak Kamdi',
    unreadCount: 1,
    messages: [
      {
        id: 'msg_01',
        sender: 'brand',
        senderName: 'Claire (Acme Atelier)',
        text: 'Hi Sarthak! We loved your proposal. Escrow is fully funded on Kollavo ($1,400 USD). Looking forward to the draft video.',
        timestamp: '2026-09-24T16:15:00Z',
      },
      {
        id: 'msg_02',
        sender: 'creator',
        senderName: 'Sarthak Kamdi',
        text: 'Thank you Claire! Just uploaded Draft Cut v1 to the Content Approval Workspace. Let me know what you think of the pacing.',
        timestamp: '2026-09-25T18:25:00Z',
      },
      {
        id: 'msg_03',
        sender: 'brand',
        senderName: 'Claire (Acme Atelier)',
        text: 'Watching right now! The tactile macro shots look extraordinary. Left one small note about keeping our end logo card on screen for 2.5s.',
        timestamp: '2026-09-25T18:40:00Z',
      },
    ],
    isDemo: true,
  },
];

// 10. Dispute Center Cases (Prompt Section 34 & 66)
export interface DisputeCase {
  id: string;
  campaignId: string;
  campaignTitle: string;
  openedBy: 'creator' | 'brand';
  openedByName: string;
  partyOpposed: string;
  reason: 'Deliverable delay' | 'Payment dispute' | 'Usage rights violation' | 'Revision dispute';
  description: string;
  status: 'Reported' | 'Evidence Submitted' | 'Under Review' | 'Resolved' | 'Closed';
  createdAt: string;
  auditTrail: { timestamp: string; note: string }[];
  isDemo: boolean;
}

export const INITIAL_DISPUTES: DisputeCase[] = [];

// 11. Fraud / Risk Detection Engine Flags (Prompt Section 36 & 68)
export interface RiskFlag {
  id: string;
  entityType: 'creator' | 'brand' | 'campaign';
  entityId: string;
  entityName: string;
  severity: 'low' | 'medium' | 'high';
  signal: string;
  explanation: string;
  flaggedAt: string;
  status: 'active' | 'investigating' | 'dismissed';
  isDemo: boolean;
}

export const INITIAL_RISK_FLAGS: RiskFlag[] = [
  {
    id: 'rf_01',
    entityType: 'creator',
    entityId: 'unverified_ext_09',
    entityName: 'External Applicant (@rapid_growth_22)',
    severity: 'medium',
    signal: 'Sudden Follower Velocity Spike (+380% in 18 hours)',
    explanation: 'Instagram Graph API telemetry detected abnormal burst without associated viral media posts. Flagged for manual review before brand discovery placement.',
    flaggedAt: '2026-09-25T09:12:00Z',
    status: 'investigating',
    isDemo: true,
  },
];

// 12. Local Storage Synchronized Store Class
class KollavoStoreManager {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Store notify error:', err);
      }
    });
  }

  // Getters with demo data filtering support
  public getCreators(includeDemo: boolean = true): Creator[] {
    return includeDemo ? INITIAL_CREATORS : INITIAL_CREATORS.filter((c) => !c.isDemo);
  }

  public getBrands(includeDemo: boolean = true): Brand[] {
    return includeDemo ? INITIAL_BRANDS : INITIAL_BRANDS.filter((b) => !b.isDemo);
  }

  public getCampaigns(includeDemo: boolean = true): Campaign[] {
    return includeDemo ? INITIAL_CAMPAIGNS : INITIAL_CAMPAIGNS.filter((c) => !c.isDemo);
  }

  public getApplications(includeDemo: boolean = true): CampaignApplication[] {
    return includeDemo ? INITIAL_APPLICATIONS : INITIAL_APPLICATIONS.filter((a) => !a.isDemo);
  }

  public getCollaborations(includeDemo: boolean = true): Collaboration[] {
    return includeDemo ? INITIAL_COLLABORATIONS : INITIAL_COLLABORATIONS.filter((c) => !c.isDemo);
  }

  public getLedger(includeDemo: boolean = true): FinancialLedgerEntry[] {
    return includeDemo ? INITIAL_FINANCIAL_LEDGER : INITIAL_FINANCIAL_LEDGER.filter((l) => !l.isDemo);
  }

  public getMessages(includeDemo: boolean = true): MessageThread[] {
    return includeDemo ? INITIAL_MESSAGES : INITIAL_MESSAGES.filter((m) => !m.isDemo);
  }

  public getRiskFlags(includeDemo: boolean = true): RiskFlag[] {
    return includeDemo ? INITIAL_RISK_FLAGS : INITIAL_RISK_FLAGS.filter((r) => !r.isDemo);
  }

  public getDisputes(includeDemo: boolean = true): DisputeCase[] {
    return includeDemo ? INITIAL_DISPUTES : INITIAL_DISPUTES.filter((d) => !d.isDemo);
  }

  // Add Campaign helper
  public addCampaign(campaign: Omit<Campaign, 'id' | 'applicantsCount' | 'confirmedCreatorsCount' | 'isDemo'>) {
    const newCamp: Campaign = {
      ...campaign,
      id: `cmp_${Date.now()}`,
      applicantsCount: 0,
      confirmedCreatorsCount: 0,
      isDemo: false, // User created record is real
    };
    INITIAL_CAMPAIGNS.unshift(newCamp);
    this.notify();
    return newCamp;
  }

  // Add Application helper
  public addApplication(application: Omit<CampaignApplication, 'id' | 'submittedAt' | 'isDemo'>) {
    const newApp: CampaignApplication = {
      ...application,
      id: `app_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      isDemo: false,
    };
    INITIAL_APPLICATIONS.unshift(newApp);

    // Update campaign applicant count
    const camp = INITIAL_CAMPAIGNS.find((c) => c.id === application.campaignId);
    if (camp) {
      camp.applicantsCount += 1;
    }

    this.notify();
    return newApp;
  }

  // Add Message helper
  public addMessage(threadId: string, text: string, sender: 'creator' | 'brand', senderName: string) {
    const thread = INITIAL_MESSAGES.find((t) => t.id === threadId);
    if (thread) {
      thread.messages.push({
        id: `msg_${Date.now()}`,
        sender,
        senderName,
        text,
        timestamp: new Date().toISOString(),
      });
      this.notify();
    }
  }

  // Update Collaboration Step helper
  public updateCollaborationStep(collabId: string, step: Collaboration['workflowStep']) {
    const collab = INITIAL_COLLABORATIONS.find((c) => c.id === collabId);
    if (collab) {
      collab.workflowStep = step;
      if (step === 'Completed') {
        collab.status = 'Completed';
        collab.escrowStatus = 'Released';
      }
      this.notify();
    }
  }

  // Submit Collaboration Deliverable draft
  public submitDeliverable(collabId: string, title: string, notes: string, assetUrl: string) {
    const collab = INITIAL_COLLABORATIONS.find((c) => c.id === collabId);
    if (collab) {
      const version = collab.submissions.length + 1;
      collab.submissions.unshift({
        id: `sub_${Date.now()}`,
        version,
        title,
        assetUrl,
        notes,
        status: 'Under Review',
        submittedAt: new Date().toISOString(),
      });
      collab.workflowStep = 'Review';
      this.notify();
    }
  }
}

export const kollavoStore = new KollavoStoreManager();
