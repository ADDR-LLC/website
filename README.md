This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog admin password setup (local and deployed)

The blog supports password-protected admin editing routes and uses two environment variables:

- `BLOG_ADMIN_PASSWORD` (required): the password you type on `/admin/login`.
- `BLOG_ADMIN_SESSION_SECRET` (recommended): secret used to sign session cookies.
  - If this is not set, the app falls back to `BLOG_ADMIN_PASSWORD`.

### Local development

Set env vars before starting your dev server.

PowerShell:

```powershell
$env:BLOG_ADMIN_PASSWORD="replace-with-strong-password"
$env:BLOG_ADMIN_SESSION_SECRET="replace-with-long-random-secret"
npm run dev
```

Command Prompt:

```cmd
set BLOG_ADMIN_PASSWORD=replace-with-strong-password
set BLOG_ADMIN_SESSION_SECRET=replace-with-long-random-secret
npm run dev
```


Linux/macOS (bash/zsh):

```bash
export BLOG_ADMIN_PASSWORD="replace-with-strong-password"
export BLOG_ADMIN_SESSION_SECRET="replace-with-long-random-secret"
npm run dev
```

Then:

1. Open `/admin/login`
2. Enter `BLOG_ADMIN_PASSWORD`
3. If correct, a signed cookie session is set and you can manage posts at `/admin/blog`
4. In create/edit, the Date & time field is optional. If left empty, the save time is used automatically (to the minute).
5. Posts can be deleted from the admin list or from the edit page “Danger zone”.

### Deployed environments (Vercel / Netlify / server-hosted Next.js)

Set the same environment variables in your hosting provider settings:

- `BLOG_ADMIN_PASSWORD`
- `BLOG_ADMIN_SESSION_SECRET`

After saving, **redeploy** so the server sees updated env vars.

### Important: GitHub Pages behavior

GitHub Pages is static hosting and does not run the server-side auth logic used by this app. That means:

- `/admin/login` server actions will not work there.
- `next/headers` cookie/session auth checks will not work there.
- This password-protected admin flow requires a platform that supports Next.js server features.

If you need GitHub Pages specifically, use an external CMS or move admin/auth to a separate backend.

## Embedding interactive demos in posts

Inside post markdown content, use a fenced code block with the `embed` language and provide a single URL:

````md
```embed
https://stackblitz.com/edit/your-demo
```
````

Allowed hosts are restricted to `codepen.io`, `codesandbox.io`, and `stackblitz.com`.

## Runnable Python snippets in blog posts

Use a `python-run` fenced code block to include Python that readers can execute in-browser (Pyodide).

````md
```python-run
import numpy as np
print(np.arange(5))
```
````

### Choosing libraries for each post

In the admin create/edit form, select common Python libraries (`numpy`, `matplotlib`, `pandas`, `scipy`) and optionally add extra libraries in the “Additional Python libraries” field.

Those selections are saved in post frontmatter as `pythonPackages`, for example:

```md
pythonPackages: "numpy, matplotlib"
```

At runtime, selected libraries are preloaded before snippet execution. If a package is not in the default Pyodide bundle (for example `seaborn`), the runner attempts installation via `micropip` in-browser.

Notes:

- Readers can run code and see output, but the blog page does not expose an editor for changing snippet code.
- Execution happens in the browser runtime, not on your server.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
