# Production launch checklist

- [ ] Verify MAVORA domain, social handles, and trademark availability. The name is a working brand until then.
- [ ] Replace example support contact and social links in `src/config/brand.ts` or environment configuration.
- [ ] Configure Supabase Auth, Google OAuth, email verification, password resets, and approved redirects.
- [ ] Apply migrations, RLS policies, storage bucket policies, backups, and monitoring.
- [ ] Configure payment, social APIs, email, and background-job providers with signed webhooks and production credentials.
- [ ] Test creator, brand owner, team member, finance, viewer, and admin permission paths.
- [ ] Run `npm run lint`, `npm run build`, responsive accessibility tests, and a production smoke test.
- [ ] Publish privacy, terms, cookies, and support procedures with jurisdiction-specific legal review.
