# Oriental Modular Website Architecture

> The live implementation now uses Supabase instead of browser-local content. See `SUPABASE_SETUP.md` and `supabase-oriental.sql` for the production setup.

## Current Frontend

`src/context/siteContent.js` is the single content contract. The homepage, header,
principal page, about page and admin portal all read the same structured data.

Each homepage block is an independent component:

- `AdmissionPopup.jsx`
- `HeroSlideshow.jsx`
- `LatestHighlights.jsx`
- `NoticesSection.jsx`
- `ToppersSection.jsx`
- `PrincipalPreview.jsx`
- `ManagementSection.jsx`
- `FacilitiesSection.jsx`
- `LearningBeyondBooks.jsx`
- `InitiativesSection.jsx`
- `AdmissionBand.jsx`
- `Footer.jsx`

Oriental-owned images extracted from the old site are stored in `public/oriental`.
The new pages do not depend on the old GitHub Pages URL at runtime.

## Supabase Modules

The Supabase project has these responsibilities:

1. **Auth**: allow only approved school staff to open `/admin`.
2. **Postgres**: store the complete, versionable content document in the
   `site_content` table. Its stable row ID is `oriental-main`.
3. **Storage**: keep hero, gallery, portrait and notice-document uploads in a
   public `site-assets` bucket. Browser uploads are converted to WebP first.
4. **Realtime**: notify open public pages when `oriental-main` is published.

## Adapter Boundary

Supabase calls remain outside the visual website components. The provider exposes:

```js
reload()
publish(content)
uploadImage(file, folder)
login(email, password)
logout()
```

The components should continue calling `useSiteContent()`. This means database
or schema changes remain contained in the adapter instead of spreading through
every section.

## Environment Variables

Create a local `.env` file only after copying values from the Supabase project:

```text
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never place the Supabase service-role key in this frontend. Use Row Level Security
so public visitors can read published content while authenticated admin users can
create, update and archive it.
