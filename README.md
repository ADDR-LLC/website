# ADDR Website

A Next.js website with a password-protected blog admin for creating and managing articles. Articles are stored in a private [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store — no database required.

## Local development

### Prerequisites

- Node.js 20+
- An `.env.local` file in the project root (see below)

### Getting the `.env.local` file

**Ask Aman** — he holds the team's local credentials. Do not create your own values for `BLOB_READ_WRITE_TOKEN`; you need the token for the shared store or you won't be able to read/write articles locally.

### `.env.local` format

Once you have the credentials, create `.env.local` in the project root with this structure:

```bash
# Vercel Blob — private store for article .mdx files
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_…

# Blog admin auth
BLOG_ADMIN_PASSWORD=your-password-here
BLOG_ADMIN_SESSION_SECRET=your-session-secret-here
```

This file is gitignored and must never be committed.

### Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seeding the Blob store (first-time only)

If the Blob store is empty and you need to upload any local `.mdx` drafts from `src/content/blog/`:

```bash
node --env-file=.env.local scripts/seed-blob.mjs
```

This is safe to re-run — it overwrites any existing blobs with the same slug.

---

## Blog admin

The admin is a password-protected interface for creating, editing, and deleting blog posts. It is **not linked from the public site** — navigate to it directly.

| Route | Purpose |
|---|---|
| `/admin/login` | Enter `BLOG_ADMIN_PASSWORD` to log in |
| `/admin/blog` | Dashboard — create a new post, view/edit/delete existing posts |
| `/admin/blog/[slug]` | Edit a specific post |

### Logging in

Go to `/admin/login` and enter the admin password. On success, a signed session cookie is set (8-hour TTL). If you enter the wrong password 5 times within 15 minutes, the IP is rate-limited.

### Creating / editing posts

Fill in the form fields:

- **Title** — also determines the URL slug (e.g. "Hello World" → `/blog/hello-world`)
- **Date & time** — defaults to your current local time and timezone
- **Excerpt** — short summary shown on the blog listing page
- **Tags** — comma-separated
- **Python libraries** — check any libraries readers will need to run `python-run` code blocks in this post; add unlisted ones in the extra field
- **Content** — full Markdown (supports `embed` and `python-run` blocks, see below)

Changes are saved to Vercel Blob. The public blog pages revalidate automatically after each save/delete.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Yes | Read-write token for the private Vercel Blob store |
| `BLOG_ADMIN_PASSWORD` | Yes | Password for the `/admin/login` form |
| `BLOG_ADMIN_SESSION_SECRET` | Recommended | Signs session cookies; falls back to `BLOG_ADMIN_PASSWORD` if unset |

For **production (Vercel)**: add `BLOG_ADMIN_PASSWORD` and `BLOG_ADMIN_SESSION_SECRET` in the Vercel dashboard under Settings → Environment Variables. `BLOB_READ_WRITE_TOKEN` is added automatically when the Blob store is connected to the project. Redeploy after any env var change.

---

## Embedding interactive demos in posts

Use a fenced `embed` code block with a single URL:

````md
```embed
https://stackblitz.com/edit/your-demo
```
````

Allowed embed hosts: `codepen.io`, `codesandbox.io`, `stackblitz.com`.

---

## Runnable Python snippets in posts

Use a `python-run` fenced code block to let readers execute Python in-browser (via Pyodide):

````md
```python-run
import numpy as np
print(np.arange(5))
```
````

Libraries selected in the admin form are preloaded before execution. Packages not in the default Pyodide bundle (e.g. `seaborn`) are installed via `micropip` at runtime. Execution happens entirely in the reader's browser — nothing runs on the server.

---

## Deployment

Deployed automatically on Vercel on every push to `main`. The site requires a platform that supports Next.js server features (cookies, server actions) — it will not work on static hosts like GitHub Pages.
