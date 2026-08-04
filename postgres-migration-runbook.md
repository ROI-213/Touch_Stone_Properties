# Supabase to Self-Hosted PostgreSQL Migration Runbook

## Current State

- Source: Supabase PostgreSQL 17.6.
- Target: self-hosted PostgreSQL 14.23 database `touch590`.
- Target connectivity: verified.
- Target schema state during audit: empty `public` schema, only `plpgsql` extension.
- Local PostgreSQL CLI tools: `psql`, `pg_dump`, and `pg_restore` are not installed on this Windows machine.
- Generated schema draft: `phase2-postgres14-schema-draft.sql`.
- Rollback-only validation against target PostgreSQL 14.23: passed.

## Phase 2: Schema Migration

Use `phase2-postgres14-schema-draft.sql` as the first migration draft. It creates:

- `public.app_users` as the replacement for Supabase `auth.users`.
- All 32 public application tables.
- `public.app_role` enum.
- Primary keys, unique constraints, check constraints, foreign keys.
- Required extensions: `pgcrypto`, `uuid-ossp`.
- App-compatible helper functions: `has_role`, `has_staff_permission`, `current_app_user_id`, `current_staff_user_id`.
- Existing business triggers: timestamp updates, hot property flag sync, top-featured limit.

The draft intentionally does not create Supabase-owned schemas:

- `auth`
- `storage`
- `realtime`
- `vault`
- `graphql`

It also disables database RLS in the target because Supabase `auth.uid()` is not available in native PostgreSQL. Authorization must move to the app server.

## Phase 2: Data Export and Import

Preferred export/import method on a machine with PostgreSQL client tools:

```bash
pg_dump "$SUPABASE_DATABASE_URL" \
  --data-only \
  --schema=public \
  --column-inserts \
  --no-owner \
  --no-privileges \
  > public-data.sql

psql "$TARGET_DATABASE_URL" -f phase2-postgres14-schema-draft.sql
psql "$TARGET_DATABASE_URL" -f public-data.sql
```

Auth users need a separate export:

```sql
INSERT INTO public.app_users (
  id,
  email,
  password_hash,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at
FROM auth.users;
```

Password strategy must be chosen before launch:

- Safer: import users and force password reset for everyone.
- Faster: reuse Supabase `encrypted_password` only if the new auth layer verifies the same hash format.

## Phase 2: Storage Migration

Supabase storage inventory:

- `banners`: 12 objects.
- `property-media`: 23 objects.
- `site-media`: 23 objects.
- `success-stories`: 10 objects.

Recommended target mapping:

```text
/var/www/touchstone/uploads/banners
/var/www/touchstone/uploads/property-media
/var/www/touchstone/uploads/site-media
/var/www/touchstone/uploads/success-stories
```

Replace signed Supabase URLs with app-served media URLs. Keep uploaded files private at the filesystem level and serve through controlled routes when needed.

## Phase 3: Code Migration Plan

Recommended stack:

- Database access: `pg` first, Drizzle later if you want typed schema management.
- API layer: TanStack Start server functions/routes.
- Auth: server-owned session cookies plus bcrypt/argon password hashes.
- Authorization: server middleware using `user_roles`, `staff_users`, and `staff_permissions`.
- Storage: local filesystem initially; MinIO/S3 later if you need object storage semantics.
- Realtime: polling or server-sent events for CMS refreshes.

New environment variables:

```env
DATABASE_URL=postgresql://touch590:[PASSWORD]@168.119.64.101:5432/touch590
JWT_SECRET=[generate-a-long-random-secret]
SESSION_SECRET=[generate-a-long-random-secret]
STORAGE_PATH=/var/www/touchstone/uploads
PUBLIC_STORAGE_BASE_URL=/uploads
```

Remove these after migration:

```env
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY
VITE_SUPABASE_PROJECT_ID
```

Key files to replace:

- `src/integrations/supabase/client.ts`: replace with browser API client helpers.
- `src/integrations/supabase/client.server.ts`: replace with server DB pool.
- `src/integrations/supabase/admin.server.ts`: replace with privileged server services.
- `src/integrations/supabase/auth-middleware.ts`: replace with JWT/session middleware.
- `src/integrations/supabase/auth-attacher.ts`: replace with session attachment.
- `src/contexts/AuthContext.tsx`: replace Supabase session state with app session state.
- `src/components/auth/AuthModal.tsx`: replace Supabase login/signup/reset calls with app auth endpoints.
- `src/lib/*.ts`: replace direct `.from()`, `.rpc()`, `.storage()` calls with server functions.
- `src/hooks/useCmsRealtime.ts`, `src/components/Hero.tsx`, `src/components/SearchPanel.tsx`: replace Supabase realtime subscriptions.

## Verification Checklist

- Run schema script on target.
- Import data.
- Import auth users or force password reset.
- Copy all 68 storage objects.
- Verify row counts for all 32 public tables.
- Verify foreign keys.
- Verify admin login and staff permissions.
- Verify customer login/profile/wishlist/enquiries.
- Verify uploads and media display.
- Verify no `@supabase/supabase-js` imports remain.
- Verify no Supabase env vars remain.
- Verify phpPgAdmin shows all migrated tables in `touch590`.

