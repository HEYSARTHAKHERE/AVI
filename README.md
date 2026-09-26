# MAVORA

**Create Together. Grow Everywhere.** MAVORA is a creator–brand collaboration workspace for public discovery, campaign operations, shared delivery workflows, analytics, and payments.

> The MAVORA name is a working brand. Domain, social-handle, and trademark availability must be checked before launch; this repository makes no claim of clearance.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. The app runs with an explicit demo path when Supabase credentials are absent; it does not represent a production authentication configuration.

## Commands

```bash
npm run lint    # strict TypeScript validation
npm run build   # Vite production bundle
npm run dev     # Express + Vite development server
```

## Product areas

- Public marketing, creator directory, brand directory, campaign discovery, and privacy-respecting public profiles.
- Creator workspace: profile, portfolio, media kit, rates, collaborations, messages, calendar, earnings, and analytics.
- Brand workspace: organization profile, creator discovery, campaigns, applications, CRM, and payment operations.
- Admin operations with moderation, risk, ledger, and dispute views.

## Configuration and deployment

Brand copy and deployment defaults live in `src/config/brand.ts`; client-safe values use `VITE_` variables. See [architecture](docs/architecture.md), [database](docs/database.md), [integrations](docs/integrations.md), [deployment](docs/deployment.md), and the [launch checklist](docs/launch-checklist.md) before deploying.
