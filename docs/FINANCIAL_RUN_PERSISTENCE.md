# Financial run persistence deployment

Financial Intelligence uses the existing Auth.js workspace identity and a single PostgreSQL/Supabase REST adapter. The actor is a stable one-way email digest; there is currently no tenant or role model. Every read and write includes that actor as `owner_id`, and foreign-owned IDs return the same not-found response as absent IDs.

## Production configuration

1. Create a production Supabase/PostgreSQL project with `pgcrypto` available.
2. Apply `migrations/001_financial_runs.sql` in the SQL editor (or `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_financial_runs.sql`).
3. Set `FINANCIAL_DATABASE_REST_URL` and the server-only `FINANCIAL_DATABASE_SERVICE_KEY` in Vercel Production and Preview as appropriate.
4. Redeploy and verify create, sign-out/sign-in resume, review, archive, and revision isolation with two allowlisted users.

The upload buffer is inspected in memory and discarded. Only the SHA-256 document fingerprint and bounded structured financial contract are stored. Normal UI lifecycle is archive-only; automatic hard deletion is not implemented. Database backups, regional residency, service-key rotation, deletion by support, and production migration execution remain operator responsibilities.
