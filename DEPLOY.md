# Deployment

Generated pages use depth-aware relative paths for assets and internal navigation. The site can be
served from a domain root, a subdirectory such as `/Target/`, or directly from the generated HTML
files. Canonical, Open Graph, sitemap and robots URLs still use `siteUrl` from `config/site.json`.

## Local preview

Browse the existing XAMPP copy at `http://localhost/Target/`. You can also run `npx serve .` from
the repo root or open `index.html` directly.

## Build

The HTML files are build output, not hand-edited. After changing anything in `templates/`,
`scripts/`, `data/` or `assets/css/`, regenerate and verify:

```
node scripts/generate.js
node scripts/verify.js
```

For hosting platforms, run `node scripts/build.js`. It performs both checks and creates a clean
production artifact in `dist/`.

`scripts/generate.js` is the single source of truth for the 52 HTML pages, `sitemap.xml` and
`robots.txt` — all derived from `config/site.json`.

## Continuous deployment

`.github/workflows/deploy.yml` validates pull requests and every push to `master`. For public
repositories, a successful `master` build publishes the generated site through GitHub Pages.
GitHub Free does not provide Pages for private repositories, so private repositories retain the
validation pipeline while deployment waits for a supported host such as Cloudflare Pages or
Netlify, a paid GitHub plan, or a change to public visibility.

Before the production launch, replace `siteUrl` and the placeholder WhatsApp number in
`config/site.json`, regenerate the site, and commit the resulting files.
