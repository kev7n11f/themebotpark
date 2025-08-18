# Security & Configuration Overview

This document summarizes security-related configurations introduced:

- Centralized environment validation (config/env.js)
- Strong JWT secret required in production (auto-generated only for dev)
- Password hashing with bcrypt
- Stripe plan whitelisting (no arbitrary price IDs)
- Optional Stripe webhook endpoint with signature verification
- Rate limiting (global + contact form) configurable via env
- Helmet for basic HTTP header hardening
- CORS restricted to configured origins
- Email sending only if credentials configured; otherwise safely skipped

Future recommendations:
- Replace in-memory demo users with persistent database (use DATABASE_URL)
- Add refresh token rotation & revocation list
- Implement audit logging & structured logs
- Add CSRF protection for any cookie-based auth (currently using Bearer tokens)
- Implement per-user rate limiting
- Add unit/integration tests for auth + billing flows