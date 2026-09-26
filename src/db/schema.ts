import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (Firebase Auth UID + MAVORA role)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('creator'), // 'creator' | 'brand' | 'admin'
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Creator Profiles table
export const creatorProfiles = pgTable('creator_profiles', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull().unique(),
  username: text('username').notNull().unique(),
  bio: text('bio'),
  headline: text('headline'),
  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),
  category: text('category').default('Fashion'),
  categories: text('categories').default('["Fashion"]'), // JSON string array
  location: text('location'),
  country: text('country').default('US'),
  city: text('city'),
  languages: text('languages').default('["English"]'),
  timezone: text('timezone').default('UTC'),
  creatorType: text('creator_type').default('Influencer'),
  verified: boolean('verified').notNull().default(false),
  featuredRate: integer('featured_rate').default(0),
  completionPercentage: integer('completion_percentage').default(40),
  availability: text('availability').default('Available for Q3/Q4'),
  visibility: text('visibility').default('public'), // 'public' | 'brands_only' | 'private'
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Brand Profiles table
export const brandProfiles = pgTable('brand_profiles', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull().unique(),
  slug: text('slug').notNull().unique(),
  companyName: text('company_name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  industry: text('industry').default('Fashion & Luxury'),
  companySize: text('company_size').default('11-50'),
  description: text('description'),
  country: text('country').default('US'),
  city: text('city'),
  businessEmail: text('business_email'),
  verifiedStatus: text('verified_status').default('Unverified'), // 'Unverified' | 'Pending' | 'Verified' | 'Restricted'
  budgetCurrency: text('budget_currency').default('USD'),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Campaigns table
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  campaignId: text('campaign_id').notNull().unique(),
  brandUid: text('brand_uid').notNull(),
  brandName: text('brand_name').notNull(),
  title: text('title').notNull(),
  productService: text('product_service').notNull(),
  objective: text('objective').notNull(),
  description: text('description').notNull(),
  budget: integer('budget').notNull(),
  currency: text('currency').default('USD'),
  platforms: text('platforms').default('["Instagram"]'),
  deliverables: text('deliverables').default('["1x Reel", "2x Stories"]'),
  targetCountries: text('target_countries').default('["United States", "Global"]'),
  status: text('status').default('Active'), // 'Draft' | 'Active' | 'In Review' | 'Completed' | 'Archived'
  deadline: text('deadline'),
  templateType: text('template_type').default('Influencer Campaign'),
  usageRights: text('usage_rights').default('30-day digital ad usage'),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 5. Campaign Applications & Fit table
export const campaignApplications = pgTable('campaign_applications', {
  id: serial('id').primaryKey(),
  applicationId: text('application_id').notNull().unique(),
  campaignId: text('campaign_id').notNull(),
  creatorUid: text('creator_uid').notNull(),
  creatorName: text('creator_name').notNull(),
  creatorUsername: text('creator_username').notNull(),
  status: text('status').default('Applied'), // 'Applied' | 'Shortlisted' | 'Invited' | 'Accepted' | 'Declined'
  proposal: text('proposal').notNull(),
  requestedRate: integer('requested_rate').notNull(),
  currency: text('currency').default('USD'),
  transparentFitData: text('transparent_fit_data'), // JSON string with niche, location, platform matches
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Collaborations table (full 14-step lifecycle)
export const collaborations = pgTable('collaborations', {
  id: serial('id').primaryKey(),
  collabId: text('collab_id').notNull().unique(),
  campaignId: text('campaign_id').notNull(),
  campaignTitle: text('campaign_title').notNull(),
  brandName: text('brand_name').notNull(),
  brandUid: text('brand_uid').notNull(),
  creatorUid: text('creator_uid').notNull(),
  creatorName: text('creator_name').notNull(),
  platform: text('platform').default('Instagram'),
  deliverables: text('deliverables').notNull(),
  paymentAmount: integer('payment_amount').notNull(),
  currency: text('currency').default('USD'),
  deadline: text('deadline').notNull(),
  status: text('status').default('Confirmed'), // 'Inquiry' | 'Negotiating' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  workflowStep: text('workflow_step').default('Content Creation'), // 'Agreement' | 'Content Creation' | 'Submission' | 'Review' | 'Revision' | 'Approval' | 'Publication' | 'Payment' | 'Completed'
  agreementDetails: text('agreement_details'),
  submissionsData: text('submissions_data'), // JSON array of assets, versions, comments
  paymentStatus: text('payment_status').default('Escrow Funded'), // 'Pending' | 'Escrow Funded' | 'Released' | 'Refunded'
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. Financial Ledger table (Immutable accounting)
export const financialLedger = pgTable('financial_ledger', {
  id: serial('id').primaryKey(),
  entryId: text('entry_id').notNull().unique(),
  transactionType: text('transaction_type').notNull(), // 'Payment' | 'Payout' | 'Platform Fee' | 'Refund' | 'Escrow Deposit'
  campaignId: text('campaign_id'),
  brandUid: text('brand_uid'),
  creatorUid: text('creator_uid'),
  grossAmount: integer('gross_amount').notNull(),
  platformFee: integer('platform_fee').notNull().default(0),
  netAmount: integer('net_amount').notNull(),
  currency: text('currency').default('USD'),
  status: text('status').default('Pending'), // 'Pending' | 'Available' | 'Paid' | 'Failed' | 'Refunded'
  providerTxId: text('provider_tx_id'),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Social Accounts & Sync Status
export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  platform: text('platform').notNull(), // 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'twitch'
  username: text('username').notNull(),
  url: text('url').notNull(),
  followers: integer('followers').default(0),
  views: integer('views').default(0),
  engagementRate: text('engagement_rate').default('0%'),
  status: text('status').default('NOT_CONFIGURED'), // 'VERIFIED' | 'SYNCED' | 'STALE' | 'UNAVAILABLE' | 'REAUTH_REQUIRED' | 'NOT_CONFIGURED'
  lastSyncedAt: timestamp('last_synced_at'),
  isDemo: boolean('is_demo').notNull().default(false),
});

// 9. Rate Cards
export const rateCards = pgTable('rate_cards', {
  id: serial('id').primaryKey(),
  creatorUid: text('creator_uid').notNull(),
  deliverableType: text('deliverable_type').notNull(),
  startingPrice: integer('starting_price').notNull(),
  currency: text('currency').default('USD'),
  turnaroundDays: integer('turnaround_days').default(5),
  notes: text('notes'),
  isPublic: boolean('is_public').default(true),
  isDemo: boolean('is_demo').notNull().default(false),
});

// 10. Disputes
export const disputes = pgTable('disputes', {
  id: serial('id').primaryKey(),
  disputeId: text('dispute_id').notNull().unique(),
  campaignId: text('campaign_id').notNull(),
  openedBy: text('opened_by').notNull(), // 'creator' | 'brand'
  reason: text('reason').notNull(),
  description: text('description').notNull(),
  evidence: text('evidence'),
  status: text('status').default('Reported'), // 'Reported' | 'Evidence Submitted' | 'Under Review' | 'Resolved' | 'Closed'
  resolution: text('resolution'),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 11. Messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  messageId: text('message_id').notNull().unique(),
  threadId: text('thread_id').notNull(),
  campaignId: text('campaign_id'),
  senderUid: text('sender_uid').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(),
  recipientUid: text('recipient_uid').notNull(),
  content: text('content').notNull(),
  attachments: text('attachments'),
  isRead: boolean('is_read').default(false),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 12. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  actorUid: text('actor_uid').notNull(),
  actorRole: text('actor_role').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  details: text('details'),
  isDemo: boolean('is_demo').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
