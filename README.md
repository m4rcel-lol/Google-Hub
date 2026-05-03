<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Google Hub

A Google-inspired dark UI for browsing public repositories across GitHub/Gitea/Forgejo-compatible instances.

## Local development

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build production assets:
   ```bash
   npm run build
   ```

## Deploy to Cloudflare Pages

This project is configured for static deployment on Cloudflare Pages.

### Option A: Cloudflare Dashboard (Git integration)

- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`

The `public/_redirects` file is included so SPA routes correctly fall back to `index.html`.

### Option B: Wrangler CLI

1. Install Wrangler:
   ```bash
   npm install -D wrangler
   ```
2. Build the app:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   npx wrangler pages deploy dist
   ```

The repository includes `wrangler.toml` with `pages_build_output_dir = "dist"` for Cloudflare Pages compatibility.
