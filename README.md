# Vidhika Lonare — Portfolio

A handcrafted, single-page portfolio built with vanilla HTML, CSS, and a
sprinkle of JavaScript. No build step. No server. Just static files that
GitHub Pages serves directly.

- Soft blush + charcoal palette with a dark mode toggle (sun/moon in nav).
- Custom morphing cursor on desktop (dot → ring → "view →" pill).
- Smooth Lenis scrolling, GSAP parallax, and tasteful scroll-reveal fades.
- Fraunces display serif + Inter body, loaded via Google Fonts with
  `font-display: swap`.
- Generated résumé PDF at `assets/Vidhika_Lonare_Resume.pdf`.
- Fully responsive, keyboard accessible, `prefers-reduced-motion` aware.

## Preview locally

```bash
python3 -m http.server 8000
# → open http://localhost:8000
```

That's it — no Node, no Docker.

## Publish to GitHub Pages

1. Push this branch to GitHub and merge it into `main` (or change the
   branch below to match your default).
2. On github.com, open the repo **vidhikalonare-pmtech/myportfolio-claude**.
3. Go to **Settings → Pages**.
4. Under **Build and deployment** pick:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`  •  **Folder:** `/ (root)`
5. Click **Save**. After ~1 minute your site is live at:

   **https://vidhikalonare-pmtech.github.io/myportfolio-claude/**

The repo includes a `.nojekyll` file so GitHub Pages serves the assets
directly without running Jekyll. No Actions workflow is required.

### Custom domain (optional, later)

Add a `CNAME` file containing `yourdomain.com`, then follow the DNS
instructions on the Pages settings screen.

## Project structure

```
index.html                     single-page markup
styles/main.css                tokens (light+dark), layout, components
styles/cursor.css              custom cursor + hover morphs
scripts/main.js                Lenis, GSAP, theme toggle, nav, rotator
scripts/cursor.js              cursor follow + morph logic
scripts/projects.js            project drawer expand/collapse
assets/favicon.svg             VL monogram
assets/og-image.svg            social share card
assets/Vidhika_Lonare_Resume.pdf
.nojekyll                      bypass Jekyll
```

## Regenerate the résumé PDF

`/tmp/gen_resume.py` (included here for reference) uses `reportlab` to
generate the PDF from the resume source text:

```bash
pip install reportlab
python3 /tmp/gen_resume.py
```

## Editing content

All copy is baked into `index.html`. Update it directly — no framework, no
data layer, no rebuild. Commit and push; Pages redeploys in seconds.
