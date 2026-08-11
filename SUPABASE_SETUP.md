# Oriental Website Supabase Setup

The website uses Supabase for shared content, administrator authentication, realtime updates, and image storage. Public visitors can read published content. Only explicitly approved administrators can publish or upload.

## 1. Create the database and storage policies

1. Open your Supabase project.
2. Open **SQL Editor** and create a new query.
3. Paste and run the complete contents of `supabase-oriental.sql`.

## 2. Create the administrator

1. Open **Authentication > Users**.
2. Choose **Add user > Create new user**.
3. Enter the administrator email and a strong password. Keep **Auto Confirm User** enabled.
4. Copy the new user's UUID.
5. Run this in SQL Editor, replacing the placeholder:

```sql
insert into public.site_admins (user_id)
values ('PASTE-THE-AUTH-USER-UUID-HERE')
on conflict (user_id) do nothing;
```

The email and password are managed only by Supabase Auth. They are never added to this repository or the content table.

## 3. Connect the local website

Create `.env.local` in the Oriental project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-ANON-KEY
```

Find both values in **Project Settings > API**. Restart the Vite server after adding them:

```bash
npm run dev
```

Open `http://localhost:5174/admin` and sign in with the Auth user created above.

## 4. Configure production

Add these environment variables in the hosting provider's project settings, then redeploy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not add `service_role`, database passwords, JWT secrets, or the administrator password to Vite variables. Vite variables are sent to the browser. The Supabase anon key is intended to be public and is restricted by the Row Level Security policies in `supabase-oriental.sql`.

## How publishing works

- The public website loads `oriental-main` from `public.site_content`.
- The admin edits an in-memory draft and presses **Publish changes**.
- Supabase RLS verifies that the signed-in user exists in `public.site_admins`.
- Images are resized, converted to WebP, and uploaded to the public `site-assets` bucket.
- Public pages receive database updates through Supabase Realtime and fetch the latest content on every page load.
- No website content is stored in browser `localStorage`.

## Add or remove another administrator

Create the Auth user first, then add the UUID:

```sql
insert into public.site_admins (user_id)
values ('USER-UUID')
on conflict (user_id) do nothing;
```

Remove publishing access without deleting the Auth user:

```sql
delete from public.site_admins
where user_id = 'USER-UUID';
```

