# Security checklist

- [ ] Enable Supabase RLS for every exposed table and test unauthenticated reads/writes.
- [ ] Enforce organization membership and role permissions on every server mutation.
- [ ] Keep service-role, payment, OAuth, and email credentials outside the client bundle.
- [ ] Validate request bodies, upload MIME types, ownership, and file sizes server-side.
- [ ] Use signed URLs for private files and expire them promptly.
- [ ] Verify webhook signatures and record idempotency keys.
- [ ] Rate-limit authentication, password-reset, contact, AI, and webhook endpoints.
- [ ] Configure CSP, secure cookies, HTTPS, audit logging, backups, and incident response.
- [ ] Complete dependency, accessibility, and penetration-test reviews before launch.
