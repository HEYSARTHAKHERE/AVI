# Deployment

Build with `npm run build` and run with `npm start` (set `NODE_ENV=production`). Configure `PORT`, `VITE_APP_URL`, Supabase client values, and only server-side provider secrets in the deployment platform’s secret manager.

Before making a canonical domain live, update Supabase redirect allow-lists, CORS, CSP/connect-src directives, webhooks, email sender domain, and the `VITE_APP_URL` configuration. Do not hardcode a purchased domain in code.
