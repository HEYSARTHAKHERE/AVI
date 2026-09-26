# Integrations

## Supabase

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the browser client. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Configure redirect URLs for local development and the deployed canonical URL before enabling password recovery or OAuth.

## AI and exchange rates

`GEMINI_API_KEY` enables server-side brief generation and assistant responses. The product uses deterministic fallbacks when it is unavailable and labels advisory output separately from verified social data. Exchange rates are informational; settlement must use the campaign’s agreed currency and a regulated payment provider.

## Social, payments, and jobs

Social OAuth, payment processors, and job queues require provider configuration and webhook signature verification before production. This repository does not claim these providers are live. Implement retries, idempotency keys, encrypted token storage, and audited webhook processing prior to launch.
