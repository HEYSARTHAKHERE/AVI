# Architecture

MAVORA is currently a TypeScript React SPA, served by Express/Vite. Route selection in `src/App.tsx` preserves browser navigation and protects workspace routes with `AuthGuard`. The UI is organized by public landing, creator workspace, brand workspace, admin, authentication, and onboarding components.

## Runtime boundaries

- **Browser:** rendering, form state, theme preference, and the Supabase client wrapper.
- **Server:** `server.ts` exposes health, AI, and exchange-rate endpoints. Credentials such as `GEMINI_API_KEY` are server-only.
- **Data:** Supabase schema and RLS policies are in `src/lib/supabase/schema.sql`; Drizzle domain definitions are in `src/db/schema.ts` for PostgreSQL deployments.

## Identity and authorization

A user can select creator, brand, or admin modes. Public routes expose only fields marked public. A production deployment must enforce organization membership and role authorization on the server or through Supabase RLS for every write; a client route guard alone is not authorization.

## Design system

`src/index.css` owns the Aurora/Obsidian semantic color tokens. Components consume semantic CSS variables rather than product-specific color values. `src/config/brand.ts` centralizes name, tagline, URLs, support contact, and social handles.
