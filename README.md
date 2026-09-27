# Ilham Bintang Satria · Portfolio

Personal portfolio site with four case studies in business process analysis, data engineering, and applied AI.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- **Pages:** every page is statically generated.
- **Hosting:** deployed on Vercel.

## Pages

| Route | Content |
|---|---|
| `/` | Hero, how I work, case studies, other projects, experience & leadership, education & toolbox, contact |
| `/work/[slug]` | One case study: problem, role, approach, key decisions, figures, and a "project facts" sidebar |
| `/sitemap.xml`, `/robots.txt` | Generated from the content, using the production URL |
| `/opengraph-image` | Social preview image, generated at build time |

## Project structure

```
src/
├── app/
│   ├── page.tsx               # home page
│   ├── work/[slug]/page.tsx   # case-study template (static params from content)
│   ├── layout.tsx             # fonts, metadata, header/footer
│   ├── globals.css            # design tokens (light + dark)
│   ├── opengraph-image.tsx, icon.svg, sitemap.ts, robots.ts, not-found.tsx
├── components/                # header, footer, cards, case-study blocks, diagrams, icons
├── content/
│   ├── site.ts                # profile, experience, leadership, education, toolbox
│   └── projects.ts            # the case studies
└── assets/images/             # screenshots and figures
```

All text lives in `src/content/`. Editing those two files is enough to update the site.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build (all pages are prerendered)
```

## Content tips

- **Add a case study:** copy one object in `src/content/projects.ts`, give it a new `slug`, and add its images to `src/assets/images/`. The page, card, and sitemap entry appear automatically.
- **Bold text:** use `**double asterisks**` inside any content string.
- **CV download:** put a PDF at `public/cv.pdf`. The "Download CV" button only shows up when that file exists.
- **Custom domain:** set `NEXT_PUBLIC_SITE_URL` (for example `https://example.com`) so metadata and the sitemap use it. On Vercel the default production URL is picked up automatically.

## Deploy

See [`docs/PANDUAN-DEPLOY.md`](docs/PANDUAN-DEPLOY.md) for the step-by-step guide (in Indonesian). In short: push to GitHub, then import the repository in Vercel from your personal account.
