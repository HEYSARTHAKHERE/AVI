# Database and storage

The project includes Supabase SQL migrations under `supabase/migrations/` and a consolidated, RLS-enabled bootstrap schema at `src/lib/supabase/schema.sql`. Drizzle definitions in `src/db/schema.ts` model users, creator and brand profiles, campaigns, applications, collaborations, ledger entries, social accounts, rate cards, disputes, messages, and audit logs.

## Apply safely

1. Create a non-production Supabase project.
2. Review each SQL migration and apply it in order using the Supabase CLI or SQL editor.
3. Verify RLS policies using a creator account, a brand account, and an unauthenticated request.
4. Back up production before migration and use transactional migrations where supported.

## Storage policy

Public avatars and explicitly public portfolio assets may be read publicly. Campaign briefs, agreements, deliverables, verification evidence, and private message attachments require private buckets, owner checks, type/size validation, and short-lived signed URLs. No service-role key may be shipped to the browser.
