# Target Contracting & Trading Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full static catalogue website for Target Contracting & Trading described in the design spec — homepage, product categories/detail pages, wholesale, brands, about, contact — deployable as-is under XAMPP/Apache with no runtime build step.

**Architecture:** A Node.js generator (dev-time only, not required at runtime) reads a single catalogue data file and renders every page through shared header/footer/card templates, writing plain `.html` files to disk. The deployed artifact is pure static HTML/CSS/JS — Node is only used while authoring to keep 40+ pages DRY. Product imagery is inline SVG placeholder art (flat color blocks in DESIGN.md palette colors) so no binary assets are needed yet and swapping in real photos later is a template change, not a content rewrite.

**Tech Stack:** Node.js (generator only, no dependencies — built-in `fs`/`path`), plain HTML5, plain CSS3 (custom properties), vanilla JS (mobile nav + small interactions), Google Fonts (Archivo Expanded, Inter, JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-09-17-target-website-design.md`

## Global Constraints

- No fabricated brands, prices, years-of-experience, certifications, testimonials, or dealership claims anywhere in copy.
- No cart/checkout — every product/category CTA leads to "Request Quote" or WhatsApp enquiry only.
- Contact details (phone, WhatsApp, email, hours, map query) come only from `config/site.json`, which ships with placeholder values — never hardcode a real-looking number elsewhere.
- Canvas is `#f2f0e9` on every page; no pure-white full-page backgrounds; no gradients, shadows, glassmorphism, or glow.
- Cobalt Command `#3051a8` used only for primary actions/active links/icon accents — never as a large background fill.
- Border-radius: 12px cards/images, 5px rectangular buttons, 100px pills/inputs/tags.
- All internal links must resolve to files the generator actually writes (verified by `scripts/verify.js` in Task 8).

---

### Task 1: Design tokens, base CSS, and site config

**Files:**
- Create: `config/site.json`
- Create: `assets/css/tokens.css`
- Create: `assets/css/main.css`
- Create: `robots.txt`
- Test: `scripts/verify.js` (stubbed in this task, extended in Task 8)

**Interfaces:**
- Produces: CSS custom properties consumed by every page (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`). `config/site.json` shape consumed by the generator in Tasks 3-7:
  ```json
  {
    "businessName": "Target Contracting & Trading",
    "tagline": "Hardware Wholesale & Trading",
    "addressLine1": "Kadakkavoor",
    "addressLine2": "Thiruvananthapuram, Kerala, India",
    "postalCode": "PLACEHOLDER-PIN",
    "phone": "+91-XXXXXXXXXX",
    "whatsapp": "91XXXXXXXXXX",
    "email": "info@example.com",
    "hours": "Mon–Sat, 9:00 AM – 7:00 PM (placeholder — confirm actual hours)",
    "mapQuery": "Kadakkavoor, Thiruvananthapuram, Kerala",
    "mapEmbedSrc": "https://www.google.com/maps?q=Kadakkavoor,+Thiruvananthapuram,+Kerala&output=embed",
    "siteUrl": "https://www.targetcontracting.example"
  }
  ```

- [ ] **Step 1: Create `config/site.json`** with the exact shape above (values are intentional placeholders, not to be replaced with invented real data).

- [ ] **Step 2: Create `assets/css/tokens.css`** with DESIGN.md's tokens, fonts substituted per spec:

```css
:root {
  --color-studio-cream: #f2f0e9;
  --color-paper-white: #ffffff;
  --color-ink-black: #141212;
  --color-pencil-gray: #a1a0a0;
  --color-sage-wash: #dde5d8;
  --color-studio-ivory: #d7d7c8;
  --color-cobalt-command: #3051a8;
  --color-forest-ink: #3f593d;
  --color-marigold: #f89c35;
  --color-buttercup: #f6dc2e;
  --color-cobalt-pop: #0159bd;
  --color-terracotta: #863a29;
  --color-rose-clay: #ed93af;
  --color-rust: #a0674f;
  --color-wheat: #b99572;
  --color-saffron: #d8c660;
  --color-olive-stone: #a9ab72;
  --color-linen-blush: #dcc5bd;
  --color-stone: #c7b8ab;

  --font-display: 'Archivo Expanded', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  --text-mono-detail: 12px;
  --text-body-sm: 15px;
  --text-body: 16px;
  --text-subheading: 18px;
  --text-display: clamp(40px, 8vw, 64px);

  --leading-mono-detail: 1.2;
  --leading-body-sm: 1.22;
  --leading-subheading: 1.25;
  --leading-display: 0.94;

  --tracking-display: -0.03em;
  --tracking-tight: -0.04em;

  --spacing-8: 8px;  --spacing-10: 10px; --spacing-12: 12px; --spacing-14: 14px;
  --spacing-16: 16px; --spacing-20: 20px; --spacing-24: 24px; --spacing-30: 30px;
  --spacing-32: 32px; --spacing-40: 40px; --spacing-64: 64px; --spacing-72: 72px;
  --spacing-90: 90px; --spacing-101: 101px; --spacing-180: 180px; --spacing-214: 214px;

  --radius-cards: 12px;
  --radius-buttons: 5px;
  --radius-pills: 100px;

  --page-max-width: 1440px;
}
```

- [ ] **Step 3: Create `assets/css/main.css`** — reset + shared layout/components used across every page (header, mobile bar, footer, buttons, pills, breadcrumb, hero grid, category grid, product grid, whatsapp float, form/input):

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700&family=Inter:wght@100;300;400&family=JetBrains+Mono:wght@300&display=swap');

* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--color-studio-cream);
  color: var(--color-ink-black);
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--text-body);
  line-height: var(--leading-subheading);
  letter-spacing: var(--tracking-tight);
}
img, svg { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
.wrap { max-width: var(--page-max-width); margin: 0 auto; padding: 0 var(--spacing-24); }

h1, h2, h3 { font-family: var(--font-display); font-weight: 700; margin: 0; letter-spacing: var(--tracking-display); line-height: var(--leading-display); }
h1 { font-size: var(--text-display); }
h2 { font-size: clamp(28px, 5vw, 40px); }
h3 { font-size: 22px; }
p { margin: 0 0 var(--spacing-16); }

/* Header */
.site-header { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-20) var(--spacing-24); border-bottom: 1px solid var(--color-ink-black); }
.site-header .wordmark { font-family: var(--font-display); font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
.site-header .wordmark span { color: var(--color-cobalt-command); }
.main-nav { display: flex; align-items: center; gap: var(--spacing-24); }
.main-nav a { font-size: var(--text-body-sm); font-weight: 300; padding-bottom: 2px; border-bottom: 1px solid transparent; }
.main-nav a:hover, .main-nav a[aria-current="page"] { color: var(--color-cobalt-command); border-bottom-color: var(--color-cobalt-command); }
.nav-toggle { display: none; background: none; border: 1px solid var(--color-ink-black); border-radius: var(--radius-buttons); padding: var(--spacing-8) var(--spacing-12); font-family: var(--font-body); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--color-ink-black); border-radius: var(--radius-buttons); padding: 14px 30px; font-size: var(--text-body-sm); font-weight: 300; font-family: var(--font-body); cursor: pointer; transition: background-color .15s ease, color .15s ease; }
.btn-primary { background: var(--color-cobalt-command); color: #fff; }
.btn-primary:hover { background: #fff; color: var(--color-ink-black); }
.btn-outline { background: transparent; color: var(--color-ink-black); }
.btn-outline:hover { background: var(--color-ink-black); color: #fff; }
.pill { display: inline-flex; align-items: center; border: 1px solid var(--color-ink-black); border-radius: var(--radius-pills); padding: 8px 20px; font-size: var(--text-body-sm); background: var(--color-sage-wash); }
.link-ghost { color: var(--color-cobalt-command); font-weight: 400; }
.link-ghost:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Breadcrumb */
.breadcrumb { font-size: 13px; color: var(--color-pencil-gray); padding: var(--spacing-16) 0; }
.breadcrumb a { color: var(--color-pencil-gray); }
.breadcrumb a:hover { color: var(--color-cobalt-command); }

/* Hero */
.hero-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--spacing-16); padding: var(--spacing-64) 0; align-items: start; }
.hero-copy { grid-column: span 3; grid-row: span 2; display: flex; flex-direction: column; gap: var(--spacing-24); justify-content: center; }
.hero-actions { display: flex; gap: var(--spacing-16); flex-wrap: wrap; }
.hero-art { border-radius: var(--radius-cards); overflow: hidden; }
.hero-art.a { grid-column: span 1; grid-row: span 2; }
.hero-art.b { grid-column: span 2; grid-row: span 1; }
.hero-art.c { grid-column: span 1; grid-row: span 1; }
.hero-art.d { grid-column: span 2; grid-row: span 1; }
.hero-art.e { grid-column: span 1; grid-row: span 1; }

/* Category grid */
.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-16); }
.category-card { border-radius: var(--radius-cards); background: var(--color-studio-ivory); padding: var(--spacing-20); display: flex; flex-direction: column; gap: var(--spacing-12); }
.category-card.featured { grid-column: span 2; grid-row: span 2; }
.category-card .art { border-radius: var(--radius-cards); aspect-ratio: 4/3; }
.category-card.featured .art { aspect-ratio: 16/10; }

/* Product grid */
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-16); }
.product-card { border: 1px solid var(--color-ink-black); border-radius: var(--radius-cards); overflow: hidden; display: flex; flex-direction: column; }
.product-card .art { aspect-ratio: 1/1; }
.product-card .art svg { transition: transform .2s ease; }
.product-card:hover .art svg { transform: scale(1.03); }
.product-card .body { padding: var(--spacing-16); display: flex; flex-direction: column; gap: var(--spacing-8); }
.product-card .cat-tag { font-size: 12px; color: var(--color-pencil-gray); text-transform: uppercase; letter-spacing: .04em; }

/* Sections */
.section { padding: var(--spacing-72) 0; border-top: 1px solid var(--color-ink-black); }
.section:first-of-type { border-top: none; }
.section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--spacing-32); gap: var(--spacing-16); flex-wrap: wrap; }

/* Wholesale band */
.wholesale-band { background: var(--color-sage-wash); border-top: 1px solid var(--color-ink-black); border-bottom: 1px solid var(--color-ink-black); padding: var(--spacing-72) 0; }
.wholesale-band .actions { display: flex; gap: var(--spacing-16); margin-top: var(--spacing-32); flex-wrap: wrap; }

/* Why grid */
.why-list { display: grid; grid-template-columns: repeat(2, 1fr); }
.why-item { padding: var(--spacing-24) 0; border-top: 1px solid var(--color-ink-black); }
.why-item:nth-child(-n+2) { border-top: none; }

/* Brands */
.brand-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--spacing-16); }
.brand-tile { border: 1px solid var(--color-ink-black); border-radius: var(--radius-cards); aspect-ratio: 2/1; display: flex; align-items: center; justify-content: center; color: var(--color-pencil-gray); font-size: 13px; }

/* Forms */
input, textarea { font-family: var(--font-body); font-weight: 300; font-size: var(--text-body-sm); border: 1px solid var(--color-ink-black); background: #fff; padding: 12px 20px; border-radius: var(--radius-pills); width: 100%; }
textarea { border-radius: var(--radius-cards); }
input:focus, textarea:focus { outline: none; border-width: 2px; }
.form-grid { display: grid; gap: var(--spacing-16); max-width: 560px; }

/* Footer */
.site-footer { background: var(--color-sage-wash); border-top: 1px solid var(--color-ink-black); padding: var(--spacing-40) 0; margin-top: var(--spacing-72); }
.footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-24); }
.footer-grid h3 { font-size: 15px; margin-bottom: var(--spacing-12); }
.footer-grid a, .footer-grid p { font-size: var(--text-body-sm); color: var(--color-ink-black); margin: 0 0 6px; }
.footer-bottom { border-top: 1px solid var(--color-ink-black); margin-top: var(--spacing-24); padding-top: var(--spacing-16); font-size: 13px; color: var(--color-pencil-gray); }

/* WhatsApp float */
.whatsapp-float { position: fixed; right: var(--spacing-20); bottom: var(--spacing-20); width: 52px; height: 52px; border-radius: 1000px; background: var(--color-cobalt-command); color: #fff; display: flex; align-items: center; justify-content: center; z-index: 50; border: 1px solid var(--color-ink-black); }

/* Mobile quick-action bar */
.mobile-bar { display: none; }

/* Mobile nav panel */
.mobile-panel { display: none; }

@media (max-width: 860px) {
  .main-nav { display: none; }
  .nav-toggle { display: inline-flex; }
  .mobile-panel.open { display: flex; flex-direction: column; gap: var(--spacing-16); padding: var(--spacing-20) var(--spacing-24); border-bottom: 1px solid var(--color-ink-black); }
  .hero-grid, .category-grid, .product-grid, .why-list, .brand-grid, .footer-grid { grid-template-columns: 1fr 1fr; }
  .hero-copy { grid-column: span 2; grid-row: auto; }
  .hero-art.a, .hero-art.b, .hero-art.c, .hero-art.d, .hero-art.e { grid-column: span 1; grid-row: auto; }
  .category-card.featured { grid-column: span 2; }
  .mobile-bar { display: flex; position: fixed; left: 0; right: 0; bottom: 0; background: #fff; border-top: 1px solid var(--color-ink-black); z-index: 40; }
  .mobile-bar a { flex: 1; text-align: center; padding: 10px 4px; font-size: 11px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  body { padding-bottom: 64px; }
  .whatsapp-float { bottom: 76px; }
}

@media (max-width: 520px) {
  .category-grid, .product-grid, .why-list, .footer-grid, .brand-grid { grid-template-columns: 1fr; }
  .category-card.featured { grid-column: span 1; }
}
```

- [ ] **Step 4: Create `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.targetcontracting.example/sitemap.xml
```

- [ ] **Step 5: Verify** — open `assets/css/tokens.css` and `assets/css/main.css` in an editor and confirm no syntax errors (balanced braces); run:

```bash
node -e "require('fs').readFileSync('assets/css/main.css','utf8')" && echo OK
```

- [ ] **Step 6: Commit**

```bash
git add config/site.json assets/css/tokens.css assets/css/main.css robots.txt
git commit -m "Add design tokens, base CSS, and site config"
```

---

### Task 2: Catalogue data and placeholder art

**Files:**
- Create: `data/catalogue.js`
- Create: `templates/art.js`

**Interfaces:**
- Produces (consumed by Tasks 3-7):
  - `data/catalogue.js` exports `{ categories, products }`
    - `categories: [{ slug, name, description, color, featured }]`
    - `products: [{ slug, categorySlug, name, color, shortSpec }]`
  - `templates/art.js` exports `renderArt({ color, icon, label })` → returns an inline `<svg>...</svg>` string (flat color rect + a simple monoline icon path + no photographic pretense).

- [ ] **Step 1: Create `templates/art.js`**

```js
'use strict';

const ICONS = {
  drill: 'M4 44h20l6-6h10l6 6h6M20 44V24h8v20M28 24l16-10',
  wrench: 'M14 40 34 20a8 8 0 1 0-6-6L8 34a4 4 0 0 0 6 6Z',
  pipe: 'M6 20h36M6 20a6 6 0 1 1 0 12M42 20a6 6 0 1 0 0 12M6 32h36',
  bolt: 'M24 6 8 26h10l-4 16 20-22H24Z',
  helmet: 'M6 34a18 18 0 0 1 36 0v4H6v-4Z M4 38h40',
  switch: 'M12 8h24v32H12ZM24 14v10',
  tape: 'M24 8a16 16 0 1 0 .1 0ZM24 18v6l6 4',
  hinge: 'M8 8h10v32H8ZM30 8h10v32H30ZM18 14h12M18 34h12',
  glue: 'M18 6h12v10l4 4v22H14V20l4-4Z',
  box: 'M6 16 24 8l18 8-18 8Zm0 0v22l18 8V24Zm36 0v22l-18 8',
};

function renderArt({ color, icon, label, radius = '12px' }) {
  const path = ICONS[icon] || ICONS.box;
  const safeLabel = String(label || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return [
    `<svg viewBox="0 0 48 48" role="img" aria-label="${safeLabel}" preserveAspectRatio="xMidYMid slice"`,
    ` style="width:100%;height:100%;display:block;border-radius:${radius};background:${color}">`,
    `<path d="${path}" fill="none" stroke="#141212" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>`,
    `</svg>`,
  ].join('');
}

module.exports = { renderArt, ICONS };
```

- [ ] **Step 2: Create `data/catalogue.js`**

```js
'use strict';

const categories = [
  { slug: 'power-tools', name: 'Power Tools', description: 'Corded and cordless power tools for site and workshop use.', color: 'var(--color-forest-ink)', icon: 'drill', featured: true },
  { slug: 'hand-tools', name: 'Hand Tools', description: 'Everyday hand tools for construction, maintenance and general use.', color: 'var(--color-wheat)', icon: 'wrench', featured: false },
  { slug: 'plumbing', name: 'Plumbing', description: 'Pipes, fittings and plumbing accessories for residential and commercial work.', color: 'var(--color-cobalt-pop)', icon: 'pipe', featured: true },
  { slug: 'electrical', name: 'Electrical', description: 'Wiring, switches and electrical accessories for site and building use.', color: 'var(--color-buttercup)', icon: 'switch', featured: false },
  { slug: 'fasteners', name: 'Fasteners', description: 'Screws, bolts, nuts and fixings for every application.', color: 'var(--color-stone)', icon: 'bolt', featured: false },
  { slug: 'construction-tools', name: 'Construction Tools', description: 'Tools and equipment for masonry, concrete and site work.', color: 'var(--color-terracotta)', icon: 'tape', featured: false },
  { slug: 'safety-products', name: 'Safety Products', description: 'Personal protective equipment and site safety supplies.', color: 'var(--color-marigold)', icon: 'helmet', featured: false },
  { slug: 'adhesives-chemicals', name: 'Adhesives & Chemicals', description: 'Adhesives, sealants and construction chemicals.', color: 'var(--color-rust)', icon: 'glue', featured: false },
  { slug: 'building-hardware', name: 'Building Hardware', description: 'Hinges, locks, handles and structural hardware.', color: 'var(--color-olive-stone)', icon: 'hinge', featured: false },
  { slug: 'general-hardware', name: 'General Hardware', description: 'General-purpose hardware items for everyday requirements.', color: 'var(--color-linen-blush)', icon: 'box', featured: false },
];

const products = [
  { slug: 'cordless-drill-driver', categorySlug: 'power-tools', name: 'Cordless Drill Driver', color: 'var(--color-forest-ink)', icon: 'drill', shortSpec: 'Battery-powered, variable speed' },
  { slug: 'angle-grinder', categorySlug: 'power-tools', name: 'Angle Grinder', color: 'var(--color-stone)', icon: 'drill', shortSpec: 'Corded, disc-driven cutting and grinding' },
  { slug: 'impact-wrench', categorySlug: 'power-tools', name: 'Impact Wrench', color: 'var(--color-wheat)', icon: 'drill', shortSpec: 'High-torque fastening tool' },

  { slug: 'claw-hammer', categorySlug: 'hand-tools', name: 'Claw Hammer', color: 'var(--color-wheat)', icon: 'wrench', shortSpec: 'Steel head, fibreglass handle' },
  { slug: 'adjustable-wrench-set', categorySlug: 'hand-tools', name: 'Adjustable Wrench Set', color: 'var(--color-rust)', icon: 'wrench', shortSpec: 'Multi-size set' },
  { slug: 'screwdriver-set', categorySlug: 'hand-tools', name: 'Screwdriver Set', color: 'var(--color-saffron)', icon: 'wrench', shortSpec: 'Flat and Phillips tips, multi-piece' },

  { slug: 'pvc-pipe-fittings', categorySlug: 'plumbing', name: 'PVC Pipe Fittings', color: 'var(--color-cobalt-pop)', icon: 'pipe', shortSpec: 'Elbows, tees and couplers' },
  { slug: 'ball-valve', categorySlug: 'plumbing', name: 'Ball Valve', color: 'var(--color-stone)', icon: 'pipe', shortSpec: 'Quarter-turn shutoff valve' },
  { slug: 'pipe-wrench', categorySlug: 'plumbing', name: 'Pipe Wrench', color: 'var(--color-rust)', icon: 'pipe', shortSpec: 'Adjustable jaw, heavy-duty' },

  { slug: 'modular-switch-socket', categorySlug: 'electrical', name: 'Modular Switch & Socket', color: 'var(--color-buttercup)', icon: 'switch', shortSpec: 'Modular plate-mount' },
  { slug: 'electrical-cable', categorySlug: 'electrical', name: 'Electrical Cable', color: 'var(--color-saffron)', icon: 'switch', shortSpec: 'Copper conductor, insulated' },
  { slug: 'mcb-distribution-box', categorySlug: 'electrical', name: 'MCB Distribution Box', color: 'var(--color-olive-stone)', icon: 'switch', shortSpec: 'Multi-way circuit protection enclosure' },

  { slug: 'stainless-steel-screws', categorySlug: 'fasteners', name: 'Stainless Steel Screws', color: 'var(--color-stone)', icon: 'bolt', shortSpec: 'Corrosion-resistant, multiple sizes' },
  { slug: 'hex-bolts-nuts', categorySlug: 'fasteners', name: 'Hex Bolts & Nuts', color: 'var(--color-wheat)', icon: 'bolt', shortSpec: 'Standard hex head, zinc-plated' },
  { slug: 'wall-anchors', categorySlug: 'fasteners', name: 'Wall Anchors', color: 'var(--color-linen-blush)', icon: 'bolt', shortSpec: 'Plastic expansion anchors' },

  { slug: 'concrete-trowel', categorySlug: 'construction-tools', name: 'Concrete Trowel', color: 'var(--color-terracotta)', icon: 'tape', shortSpec: 'Finishing trowel, steel blade' },
  { slug: 'spirit-level', categorySlug: 'construction-tools', name: 'Spirit Level', color: 'var(--color-olive-stone)', icon: 'tape', shortSpec: 'Aluminium body, multi-vial' },
  { slug: 'measuring-tape', categorySlug: 'construction-tools', name: 'Measuring Tape', color: 'var(--color-marigold)', icon: 'tape', shortSpec: 'Retractable, metric/imperial' },

  { slug: 'safety-helmet', categorySlug: 'safety-products', name: 'Safety Helmet', color: 'var(--color-marigold)', icon: 'helmet', shortSpec: 'Adjustable harness, site-rated' },
  { slug: 'safety-gloves', categorySlug: 'safety-products', name: 'Safety Gloves', color: 'var(--color-rose-clay)', icon: 'helmet', shortSpec: 'Cut-resistant work gloves' },
  { slug: 'safety-goggles', categorySlug: 'safety-products', name: 'Safety Goggles', color: 'var(--color-cobalt-pop)', icon: 'helmet', shortSpec: 'Anti-fog, impact-resistant lens' },

  { slug: 'silicone-sealant', categorySlug: 'adhesives-chemicals', name: 'Silicone Sealant', color: 'var(--color-rust)', icon: 'glue', shortSpec: 'General-purpose sealant cartridge' },
  { slug: 'construction-adhesive', categorySlug: 'adhesives-chemicals', name: 'Construction Adhesive', color: 'var(--color-terracotta)', icon: 'glue', shortSpec: 'High-strength bonding adhesive' },
  { slug: 'waterproofing-compound', categorySlug: 'adhesives-chemicals', name: 'Waterproofing Compound', color: 'var(--color-stone)', icon: 'glue', shortSpec: 'Cementitious waterproof coating' },

  { slug: 'door-hinges', categorySlug: 'building-hardware', name: 'Door Hinges', color: 'var(--color-olive-stone)', icon: 'hinge', shortSpec: 'Steel butt hinges' },
  { slug: 'cylindrical-lock-set', categorySlug: 'building-hardware', name: 'Cylindrical Lock Set', color: 'var(--color-forest-ink)', icon: 'hinge', shortSpec: 'Door lockset with cylinder' },
  { slug: 'cabinet-handles', categorySlug: 'building-hardware', name: 'Cabinet Handles', color: 'var(--color-saffron)', icon: 'hinge', shortSpec: 'Furniture-mount pull handles' },

  { slug: 'cable-ties-clips', categorySlug: 'general-hardware', name: 'Cable Ties & Clips', color: 'var(--color-linen-blush)', icon: 'box', shortSpec: 'Nylon ties, multiple lengths' },
  { slug: 'tool-storage-box', categorySlug: 'general-hardware', name: 'Tool Storage Box', color: 'var(--color-wheat)', icon: 'box', shortSpec: 'Multi-compartment storage case' },
  { slug: 'multi-purpose-tape', categorySlug: 'general-hardware', name: 'Multi-Purpose Tape', color: 'var(--color-stone)', icon: 'box', shortSpec: 'General-purpose adhesive tape' },
];

module.exports = { categories, products };
```

- [ ] **Step 3: Verify data loads**

```bash
node -e "const d=require('./data/catalogue.js'); console.log(d.categories.length, d.products.length)"
```

Expected output: `10 30`

- [ ] **Step 4: Commit**

```bash
git add data/catalogue.js templates/art.js
git commit -m "Add catalogue data and inline SVG placeholder art"
```

---

### Task 3: Shared layout and partial templates

**Files:**
- Create: `templates/partials.js`
- Create: `templates/layout.js`

**Interfaces:**
- Consumes: `config/site.json` (Task 1), `templates/art.js` `renderArt()` (Task 2).
- Produces (consumed by Tasks 4-7):
  - `renderHeader(activePath)` → string
  - `renderMobileBar()` → string
  - `renderFooter(categories)` → string
  - `renderWhatsappFloat(message)` → string
  - `renderBreadcrumb(items)` → `{ html, jsonLd }` where `items = [{ name, url }]`
  - `renderCategoryCard(cat, featured)` → string
  - `renderProductCard(product, categoryName)` → string
  - `renderPage({ title, description, canonical, activePath, bodyHtml, jsonLdBlocks })` → full HTML document string

- [ ] **Step 1: Create `templates/partials.js`**

```js
'use strict';

const site = require('../config/site.json');
const { renderArt } = require('./art.js');

function waLink(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

function renderHeader(activePath) {
  const links = [
    ['/products/index.html', 'Products'],
    ['/brands/index.html', 'Brands'],
    ['/wholesale/index.html', 'Wholesale'],
    ['/about/index.html', 'About'],
    ['/contact/index.html', 'Contact'],
  ];
  const navLinks = links.map(([href, label]) =>
    `<a href="${href}"${activePath === href ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('');
  return `
<header class="site-header">
  <a class="wordmark" href="/index.html">Target <span>Contracting &amp; Trading</span></a>
  <nav class="main-nav" aria-label="Primary">${navLinks}<a class="pill" href="/wholesale/index.html#quote">Get a Quote</a></nav>
  <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-panel">Menu</button>
</header>
<nav class="mobile-panel" id="mobile-panel" aria-label="Mobile">${navLinks}<a class="pill" href="/wholesale/index.html#quote">Get a Quote</a></nav>`;
}

function renderMobileBar() {
  return `
<nav class="mobile-bar" aria-label="Quick actions">
  <a href="tel:${site.phone}">Call</a>
  <a href="${waLink("Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.")}">WhatsApp</a>
  <a href="/contact/index.html">Directions</a>
  <a href="/products/index.html">Products</a>
  <a href="/wholesale/index.html">Quote</a>
</nav>`;
}

function renderFooter(categories) {
  const catLinks = categories.slice(0, 6).map(c => `<a href="/products/${c.slug}/index.html">${c.name}</a>`).join('');
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <h3>${site.businessName}</h3>
      <p>${site.addressLine1}<br>${site.addressLine2}</p>
    </div>
    <div>
      <h3>Contact</h3>
      <a href="tel:${site.phone}">${site.phone}</a>
      <a href="mailto:${site.email}">${site.email}</a>
      <p>${site.hours}</p>
    </div>
    <div>
      <h3>Categories</h3>
      ${catLinks}
    </div>
    <div>
      <h3>Quick Links</h3>
      <a href="/wholesale/index.html">Wholesale</a>
      <a href="/brands/index.html">Brands</a>
      <a href="/about/index.html">About</a>
      <a href="/contact/index.html">Contact</a>
    </div>
  </div>
  <div class="wrap footer-bottom">&copy; ${new Date().getFullYear()} ${site.businessName}. Hardware Wholesale &amp; Trading, Kadakkavoor.</div>
</footer>`;
}

function renderWhatsappFloat(message) {
  return `<a class="whatsapp-float" href="${waLink(message)}" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.6"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.6Z"/><path d="M8.5 9.5c0 3 2.5 5.5 5.5 5.5"/></svg>
</a>`;
}

function renderBreadcrumb(items) {
  const html = `<nav class="breadcrumb wrap" aria-label="Breadcrumb">${
    items.map((it, i) => i < items.length - 1 ? `<a href="${it.url}">${it.name}</a> / ` : `<span>${it.name}</span>`).join('')
  }</nav>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.siteUrl}${it.url}`,
    })),
  };
  return { html, jsonLd };
}

function renderCategoryCard(cat, featured) {
  return `
<a class="category-card${featured ? ' featured' : ''}" href="/products/${cat.slug}/index.html">
  <div class="art">${renderArt({ color: cat.color, icon: cat.icon, label: cat.name })}</div>
  <h3>${cat.name}</h3>
  <p>${cat.description}</p>
  <span class="link-ghost">Explore &rarr;</span>
</a>`;
}

function renderProductCard(product, categoryName) {
  return `
<a class="product-card" href="/products/${product.categorySlug}/${product.slug}.html">
  <div class="art">${renderArt({ color: product.color, icon: product.icon, label: product.name, radius: '0px' })}</div>
  <div class="body">
    <span class="cat-tag">${categoryName}</span>
    <h3 style="font-size:16px">${product.name}</h3>
    <p style="font-size:13px;color:var(--color-pencil-gray);margin:0">${product.shortSpec}</p>
    <span class="link-ghost">Enquire &rarr;</span>
  </div>
</a>`;
}

module.exports = {
  site, waLink, renderHeader, renderMobileBar, renderFooter,
  renderWhatsappFloat, renderBreadcrumb, renderCategoryCard, renderProductCard,
};
```

- [ ] **Step 2: Create `templates/layout.js`**

```js
'use strict';

const { categories } = require('../data/catalogue.js');
const { site, renderHeader, renderMobileBar, renderFooter, renderWhatsappFloat } = require('./partials.js');

function renderPage({ title, description, canonical, activePath, bodyHtml, jsonLdBlocks = [], whatsappMessage }) {
  const jsonLd = jsonLdBlocks.map(block => `<script type="application/ld+json">${JSON.stringify(block)}</script>`).join('\n');
  const defaultMessage = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${site.siteUrl}${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${site.siteUrl}${canonical}">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
${jsonLd}
</head>
<body>
${renderHeader(activePath)}
${renderMobileBar()}
<main>
${bodyHtml}
</main>
${renderFooter(categories)}
${renderWhatsappFloat(whatsappMessage || defaultMessage)}
<script src="/assets/js/main.js"></script>
</body>
</html>`;
}

module.exports = { renderPage };
```

- [ ] **Step 3: Verify templates load without error**

```bash
node -e "require('./templates/layout.js'); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 4: Commit**

```bash
git add templates/partials.js templates/layout.js
git commit -m "Add shared header/footer/card templates and page layout"
```

---

### Task 4: Homepage generator

**Files:**
- Create: `scripts/pages/home.js`

**Interfaces:**
- Consumes: `renderPage` (Task 3), `renderCategoryCard`, `renderProductCard`, `renderArt`, `data/catalogue.js`.
- Produces: `module.exports = function renderHome()` → HTML string, used by `scripts/generate.js` (Task 8).

- [ ] **Step 1: Create `scripts/pages/home.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderCategoryCard, renderProductCard } = require('../../templates/partials.js');
const { renderArt } = require('../../templates/art.js');
const { categories, products } = require('../../data/catalogue.js');

function categoryName(slug) {
  return categories.find(c => c.slug === slug).name;
}

function renderHome() {
  const heroArt = [
    { color: 'var(--color-forest-ink)', icon: 'drill', label: 'Power drill', cls: 'a' },
    { color: 'var(--color-wheat)', icon: 'wrench', label: 'Wrench', cls: 'b' },
    { color: 'var(--color-cobalt-pop)', icon: 'pipe', label: 'Pipe fittings', cls: 'c' },
    { color: 'var(--color-stone)', icon: 'bolt', label: 'Fasteners', cls: 'd' },
    { color: 'var(--color-marigold)', icon: 'helmet', label: 'Safety helmet', cls: 'e' },
  ];

  const body = `
<section class="wrap hero-grid">
  <div class="hero-copy">
    <h1>Built for the work.<br>Supplied for the trade.</h1>
    <p>Target Contracting &amp; Trading supplies hardware, tools and building essentials to contractors, businesses and customers across Kadakkavoor and surrounding areas.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/products/index.html">Explore Products</a>
      <a class="btn btn-outline" href="/wholesale/index.html">Request a Quote</a>
    </div>
  </div>
  ${heroArt.map(a => `<div class="hero-art ${a.cls}">${renderArt(a)}</div>`).join('')}
</section>

<section class="section wrap" id="categories">
  <div class="section-head">
    <h2>Everything the job needs.</h2>
    <a class="link-ghost" href="/products/index.html">View all categories &rarr;</a>
  </div>
  <div class="category-grid">
    ${categories.map(c => renderCategoryCard(c, c.featured)).join('')}
  </div>
</section>

<section class="section wrap">
  <div class="section-head">
    <h2>From shelf to site.</h2>
    <a class="link-ghost" href="/products/index.html">View all products &rarr;</a>
  </div>
  <div class="product-grid">
    ${products.slice(0, 8).map(p => renderProductCard(p, categoryName(p.categorySlug))).join('')}
  </div>
</section>

<section class="wholesale-band">
  <div class="wrap">
    <h2>Buying for the job?<br>Let's talk quantity.</h2>
    <p style="max-width:560px;margin-top:var(--spacing-16)">Contractors, businesses, maintenance teams and bulk buyers can contact Target Contracting &amp; Trading directly for product availability and quotation.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/wholesale/index.html">Request Wholesale Quote</a>
      <a class="btn btn-outline" href="/wholesale/index.html#whatsapp">WhatsApp Us</a>
    </div>
  </div>
</section>

<section class="section wrap">
  <div class="section-head"><h2>Brands professionals trust.</h2>
    <a class="link-ghost" href="/brands/index.html">View brands &rarr;</a>
  </div>
  <div class="brand-grid">
    ${Array.from({ length: 5 }).map(() => `<div class="brand-tile">Brand placeholder</div>`).join('')}
  </div>
</section>

<section class="section wrap">
  <h2>Why Target.</h2>
  <div class="why-list">
    <div class="why-item"><h3>Wholesale focused</h3><p>Suitable for contractors, businesses and volume requirements.</p></div>
    <div class="why-item"><h3>Practical sourcing</h3><p>Hardware and building essentials from one local supplier.</p></div>
    <div class="why-item"><h3>Local supply</h3><p>Based in Kadakkavoor, serving customers across the surrounding region.</p></div>
    <div class="why-item"><h3>Easy enquiries</h3><p>Call, WhatsApp or request a quotation directly.</p></div>
  </div>
</section>
`;

  return renderPage({
    title: 'Target Contracting & Trading — Hardware Wholesale & Trading, Kadakkavoor',
    description: 'Target Contracting & Trading supplies hardware, tools and building essentials to contractors and businesses in Kadakkavoor, Thiruvananthapuram, Kerala.',
    canonical: '/index.html',
    activePath: '/index.html',
    bodyHtml: body,
    jsonLdBlocks: [{
      '@context': 'https://schema.org',
      '@type': 'HardwareStore',
      name: 'Target Contracting & Trading',
      description: 'Hardware wholesale and trading business in Kadakkavoor, Thiruvananthapuram, Kerala.',
      address: { '@type': 'PostalAddress', addressLocality: 'Kadakkavoor', addressRegion: 'Kerala', addressCountry: 'IN' },
    }],
  });
}

module.exports = renderHome;
```

- [ ] **Step 2: Verify it renders**

```bash
node -e "const h=require('./scripts/pages/home.js'); const out=h(); console.log(out.includes('Built for the work'), out.length)"
```

Expected output: `true` followed by a length greater than 1000.

- [ ] **Step 3: Commit**

```bash
git add scripts/pages/home.js
git commit -m "Add homepage generator"
```

---

### Task 5: Products index and category page generators

**Files:**
- Create: `scripts/pages/products-index.js`
- Create: `scripts/pages/category.js`

**Interfaces:**
- Consumes: same template/data modules as Task 4.
- Produces: `renderProductsIndex()` → string; `renderCategoryPage(categorySlug)` → string.

- [ ] **Step 1: Create `scripts/pages/products-index.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderCategoryCard, renderBreadcrumb } = require('../../templates/partials.js');
const { categories } = require('../../data/catalogue.js');

function renderProductsIndex() {
  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
  ]);

  const body = `
${crumbHtml}
<section class="wrap section" style="border-top:none">
  <h1 style="font-size:clamp(32px,6vw,56px)">Everything the job needs.</h1>
  <div class="category-grid" style="margin-top:var(--spacing-32)">
    ${categories.map(c => renderCategoryCard(c, c.featured)).join('')}
  </div>
</section>`;

  return renderPage({
    title: 'Products — Target Contracting & Trading',
    description: 'Browse hardware categories from Target Contracting & Trading: power tools, hand tools, plumbing, electrical, fasteners and more.',
    canonical: '/products/index.html',
    activePath: '/products/index.html',
    bodyHtml: body,
    jsonLdBlocks: [crumbLd],
  });
}

module.exports = renderProductsIndex;
```

- [ ] **Step 2: Create `scripts/pages/category.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderProductCard, renderBreadcrumb } = require('../../templates/partials.js');
const { categories, products } = require('../../data/catalogue.js');

function renderCategoryPage(categorySlug) {
  const category = categories.find(c => c.slug === categorySlug);
  const catProducts = products.filter(p => p.categorySlug === categorySlug);

  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
    { name: category.name, url: `/products/${category.slug}/index.html` },
  ]);

  const body = `
${crumbHtml}
<section class="wrap section" style="border-top:none">
  <h1 style="font-size:clamp(32px,6vw,56px)">${category.name}</h1>
  <p style="max-width:640px;margin-top:var(--spacing-16)">${category.description}</p>
  <div class="product-grid" style="margin-top:var(--spacing-32)">
    ${catProducts.map(p => renderProductCard(p, category.name)).join('')}
  </div>
</section>`;

  return renderPage({
    title: `${category.name} — Target Contracting & Trading`,
    description: `${category.description} Available from Target Contracting & Trading, Kadakkavoor, Thiruvananthapuram.`,
    canonical: `/products/${category.slug}/index.html`,
    activePath: '/products/index.html',
    bodyHtml: body,
    jsonLdBlocks: [crumbLd],
    whatsappMessage: `Hi Target Contracting & Trading, I'm interested in ${category.name}. Could you please share availability and pricing?`,
  });
}

module.exports = renderCategoryPage;
```

- [ ] **Step 3: Verify both render for a sample category**

```bash
node -e "
const idx = require('./scripts/pages/products-index.js')();
const cat = require('./scripts/pages/category.js')('power-tools');
console.log(idx.includes('Everything the job needs'), cat.includes('Power Tools'), cat.includes('Cordless Drill Driver'));
"
```

Expected output: `true true true`

- [ ] **Step 4: Commit**

```bash
git add scripts/pages/products-index.js scripts/pages/category.js
git commit -m "Add products index and category page generators"
```

---

### Task 6: Product detail page generator

**Files:**
- Create: `scripts/pages/product.js`

**Interfaces:**
- Consumes: same as Task 5.
- Produces: `renderProductPage(productSlug)` → string.

- [ ] **Step 1: Create `scripts/pages/product.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderBreadcrumb, waLink } = require('../../templates/partials.js');
const { renderArt } = require('../../templates/art.js');
const { categories, products } = require('../../data/catalogue.js');

function renderProductPage(productSlug) {
  const product = products.find(p => p.slug === productSlug);
  const category = categories.find(c => c.slug === product.categorySlug);

  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
    { name: category.name, url: `/products/${category.slug}/index.html` },
    { name: product.name, url: `/products/${category.slug}/${product.slug}.html` },
  ]);

  const enquiryMessage = `Hi Target Contracting & Trading, I'm interested in ${product.name}. Could you please share availability and pricing?`;

  const specs = [
    ['Category', category.name],
    ['Specification', product.shortSpec],
    ['Brand', 'Available on enquiry'],
    ['Availability', 'Confirm with our team'],
  ];

  const body = `
${crumbHtml}
<section class="wrap section" style="border-top:none;display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-40);align-items:start">
  <div class="art" style="aspect-ratio:4/5;border-radius:var(--radius-cards);overflow:hidden">${renderArt({ color: product.color, icon: product.icon, label: product.name })}</div>
  <div>
    <span class="cat-tag">${category.name}</span>
    <h1 style="font-size:clamp(28px,5vw,44px);margin-top:var(--spacing-8)">${product.name}</h1>
    <p style="margin-top:var(--spacing-16)">Specification details and current stock availability are confirmed at the time of enquiry. Contact our team for pricing and lead time on ${product.name.toLowerCase()}.</p>
    <table style="width:100%;border-collapse:collapse;margin:var(--spacing-24) 0">
      ${specs.map(([label, value]) => `<tr><td style="padding:8px 0;border-top:1px solid var(--color-sage-wash);color:var(--color-pencil-gray);font-size:13px">${label}</td><td style="padding:8px 0;border-top:1px solid var(--color-sage-wash);text-align:right">${value}</td></tr>`).join('')}
    </table>
    <form class="form-grid" onsubmit="return false" aria-label="Request a quote">
      <label for="qty" style="font-size:13px;color:var(--color-pencil-gray)">Quantity</label>
      <input type="number" id="qty" name="qty" min="1" value="1">
      <div class="hero-actions">
        <button type="submit" class="btn btn-primary">Request Quote</button>
        <a class="btn btn-outline" href="${waLink(enquiryMessage)}" target="_blank" rel="noopener">WhatsApp Enquiry</a>
      </div>
    </form>
  </div>
</section>`;

  return renderPage({
    title: `${product.name} — ${category.name} — Target Contracting & Trading`,
    description: `${product.name}: ${product.shortSpec}. Enquire for availability and pricing from Target Contracting & Trading, Kadakkavoor.`,
    canonical: `/products/${category.slug}/${product.slug}.html`,
    activePath: '/products/index.html',
    bodyHtml: body,
    whatsappMessage: enquiryMessage,
    jsonLdBlocks: [crumbLd, {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      category: category.name,
      description: product.shortSpec,
    }],
  });
}

module.exports = renderProductPage;
```

- [ ] **Step 2: Verify**

```bash
node -e "
const out = require('./scripts/pages/product.js')('cordless-drill-driver');
console.log(out.includes('Cordless Drill Driver'), out.includes('Request Quote'), out.includes('wa.me'));
"
```

Expected output: `true true true`

- [ ] **Step 3: Commit**

```bash
git add scripts/pages/product.js
git commit -m "Add product detail page generator"
```

---

### Task 7: Wholesale, brands, about, and contact page generators

**Files:**
- Create: `scripts/pages/wholesale.js`
- Create: `scripts/pages/brands.js`
- Create: `scripts/pages/about.js`
- Create: `scripts/pages/contact.js`

**Interfaces:**
- Consumes: `renderPage`, `site` config, `waLink` (all from Task 3).
- Produces: four `render*()` functions, each returning an HTML string, used by `scripts/generate.js` (Task 8).

- [ ] **Step 1: Create `scripts/pages/wholesale.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, waLink } = require('../../templates/partials.js');

function renderWholesale() {
  const message = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const body = `
<section class="wholesale-band" id="quote">
  <div class="wrap">
    <h1>Buying for the job?<br>Let's talk quantity.</h1>
    <p style="max-width:600px;margin-top:var(--spacing-16)">Contractors, businesses, maintenance teams and bulk buyers can contact Target Contracting &amp; Trading directly for product availability and quotation. Share your requirement and our team will get back with the details you need.</p>
  </div>
</section>
<section class="wrap section" style="border-top:none">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-40)">
    <form class="form-grid" onsubmit="return false" aria-label="Wholesale quote request">
      <label for="w-name" style="font-size:13px;color:var(--color-pencil-gray)">Name</label>
      <input id="w-name" name="name" required>
      <label for="w-company" style="font-size:13px;color:var(--color-pencil-gray)">Company (optional)</label>
      <input id="w-company" name="company">
      <label for="w-contact" style="font-size:13px;color:var(--color-pencil-gray)">Phone or Email</label>
      <input id="w-contact" name="contact" required>
      <label for="w-req" style="font-size:13px;color:var(--color-pencil-gray)">Requirement</label>
      <textarea id="w-req" name="requirement" rows="4"></textarea>
      <div class="hero-actions">
        <button type="submit" class="btn btn-primary" formaction="mailto:${site.email}">Request Wholesale Quote</button>
        <a id="whatsapp" class="btn btn-outline" href="${waLink(message)}" target="_blank" rel="noopener">WhatsApp Us</a>
      </div>
    </form>
    <div class="why-list" style="grid-template-columns:1fr">
      <div class="why-item" style="border-top:none"><h3>Wholesale focused</h3><p>Suitable for contractors, businesses and volume requirements.</p></div>
      <div class="why-item"><h3>Practical sourcing</h3><p>Hardware and building essentials from one local supplier.</p></div>
      <div class="why-item"><h3>Easy enquiries</h3><p>Call, WhatsApp or request a quotation directly.</p></div>
    </div>
  </div>
</section>`;

  return renderPage({
    title: 'Wholesale — Target Contracting & Trading',
    description: 'Bulk and wholesale hardware enquiries for contractors and businesses from Target Contracting & Trading, Kadakkavoor.',
    canonical: '/wholesale/index.html',
    activePath: '/wholesale/index.html',
    bodyHtml: body,
    whatsappMessage: message,
  });
}

module.exports = renderWholesale;
```

- [ ] **Step 2: Create `scripts/pages/brands.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');

function renderBrands() {
  const body = `
<section class="wrap section" style="border-top:none">
  <h1 style="font-size:clamp(32px,6vw,56px)">Brands professionals trust.</h1>
  <p style="max-width:600px;margin-top:var(--spacing-16)">Our brand directory is being finalized. Contact our team to confirm which brands are currently in stock.</p>
  <div class="brand-grid" style="margin-top:var(--spacing-32)">
    ${Array.from({ length: 10 }).map(() => '<div class="brand-tile">Brand placeholder</div>').join('')}
  </div>
</section>`;

  return renderPage({
    title: 'Brands — Target Contracting & Trading',
    description: 'Brand directory for Target Contracting & Trading, hardware wholesale and trading, Kadakkavoor.',
    canonical: '/brands/index.html',
    activePath: '/brands/index.html',
    bodyHtml: body,
  });
}

module.exports = renderBrands;
```

- [ ] **Step 3: Create `scripts/pages/about.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');

function renderAbout() {
  const body = `
<section class="wrap section" style="border-top:none;max-width:760px">
  <h1 style="font-size:clamp(32px,6vw,56px)">About Target Contracting &amp; Trading.</h1>
  <p style="margin-top:var(--spacing-24);font-size:var(--text-subheading)">Target Contracting &amp; Trading is a hardware wholesale and trading business based in Kadakkavoor, Thiruvananthapuram, Kerala. We supply hardware, tools and building essentials to contractors, businesses and customers across the surrounding region.</p>
  <p>For product availability, brand information or bulk requirements, reach out directly through our contact or wholesale pages.</p>
</section>`;

  return renderPage({
    title: 'About — Target Contracting & Trading',
    description: 'Target Contracting & Trading is a hardware wholesale and trading business based in Kadakkavoor, Thiruvananthapuram, Kerala.',
    canonical: '/about/index.html',
    activePath: '/about/index.html',
    bodyHtml: body,
  });
}

module.exports = renderAbout;
```

- [ ] **Step 4: Create `scripts/pages/contact.js`**

```js
'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, waLink } = require('../../templates/partials.js');

function renderContact() {
  const message = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const body = `
<section class="wrap section" style="border-top:none">
  <h1 style="font-size:clamp(32px,6vw,56px)">Contact us.</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-40);margin-top:var(--spacing-32)">
    <div>
      <h3>${site.businessName}</h3>
      <p>${site.addressLine1}<br>${site.addressLine2}</p>
      <p>Phone: <a class="link-ghost" href="tel:${site.phone}">${site.phone}</a></p>
      <p>WhatsApp: <a class="link-ghost" href="${waLink(message)}">${site.phone}</a></p>
      <p>Email: <a class="link-ghost" href="mailto:${site.email}">${site.email}</a></p>
      <p>Hours: ${site.hours}</p>
      <div class="hero-actions" style="margin-top:var(--spacing-24)">
        <a class="btn btn-primary" href="tel:${site.phone}">Call Now</a>
        <a class="btn btn-outline" href="${waLink(message)}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}" target="_blank" rel="noopener">Get Directions</a>
        <a class="btn btn-outline" href="/wholesale/index.html">Request Quote</a>
      </div>
    </div>
    <iframe src="${site.mapEmbedSrc}" style="width:100%;height:320px;border:1px solid var(--color-ink-black);border-radius:var(--radius-cards)" loading="lazy" title="Map to ${site.businessName}"></iframe>
  </div>
</section>`;

  return renderPage({
    title: 'Contact — Target Contracting & Trading',
    description: 'Contact Target Contracting & Trading in Kadakkavoor, Thiruvananthapuram, Kerala for hardware enquiries and quotations.',
    canonical: '/contact/index.html',
    activePath: '/contact/index.html',
    bodyHtml: body,
    whatsappMessage: message,
    jsonLdBlocks: [{
      '@context': 'https://schema.org',
      '@type': 'HardwareStore',
      name: site.businessName,
      telephone: site.phone,
      email: site.email,
      address: { '@type': 'PostalAddress', streetAddress: site.addressLine1, addressLocality: 'Thiruvananthapuram', addressRegion: 'Kerala', addressCountry: 'IN' },
    }],
  });
}

module.exports = renderContact;
```

- [ ] **Step 5: Verify all four render**

```bash
node -e "
['wholesale','brands','about','contact'].forEach(p => {
  const fn = require('./scripts/pages/'+p+'.js');
  const out = fn();
  console.log(p, out.length > 500);
});
"
```

Expected output: four lines, each ending `true`.

- [ ] **Step 6: Commit**

```bash
git add scripts/pages/wholesale.js scripts/pages/brands.js scripts/pages/about.js scripts/pages/contact.js
git commit -m "Add wholesale, brands, about, and contact page generators"
```

---

### Task 8: Generator script, sitemap, runtime JS, and full site build

**Files:**
- Create: `scripts/generate.js`
- Create: `scripts/verify.js`
- Create: `assets/js/main.js`

**Interfaces:**
- Consumes: all `renderX` functions from Tasks 4-7, `data/catalogue.js`.
- Produces: every static `.html` file at the paths listed in the spec's site map, plus `sitemap.xml`.

- [ ] **Step 1: Create `assets/js/main.js`**

```js
(function () {
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
})();
```

- [ ] **Step 2: Create `scripts/generate.js`**

```js
'use strict';

const fs = require('fs');
const path = require('path');
const { categories, products } = require('../data/catalogue.js');
const { site } = require('../templates/partials.js');

const renderHome = require('./pages/home.js');
const renderProductsIndex = require('./pages/products-index.js');
const renderCategoryPage = require('./pages/category.js');
const renderProductPage = require('./pages/product.js');
const renderWholesale = require('./pages/wholesale.js');
const renderBrands = require('./pages/brands.js');
const renderAbout = require('./pages/about.js');
const renderContact = require('./pages/contact.js');

const ROOT = path.join(__dirname, '..');

function write(relPath, html) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html, 'utf8');
}

function generate() {
  const urls = [];

  write('index.html', renderHome());
  urls.push('/index.html');

  write('products/index.html', renderProductsIndex());
  urls.push('/products/index.html');

  categories.forEach((cat) => {
    write(`products/${cat.slug}/index.html`, renderCategoryPage(cat.slug));
    urls.push(`/products/${cat.slug}/index.html`);
  });

  products.forEach((product) => {
    write(`products/${product.categorySlug}/${product.slug}.html`, renderProductPage(product.slug));
    urls.push(`/products/${product.categorySlug}/${product.slug}.html`);
  });

  write('wholesale/index.html', renderWholesale());
  urls.push('/wholesale/index.html');

  write('brands/index.html', renderBrands());
  urls.push('/brands/index.html');

  write('about/index.html', renderAbout());
  urls.push('/about/index.html');

  write('contact/index.html', renderContact());
  urls.push('/contact/index.html');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${site.siteUrl}${u}</loc></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

  console.log(`Generated ${urls.length} pages + sitemap.xml`);
  return urls;
}

if (require.main === module) {
  generate();
}

module.exports = generate;
```

- [ ] **Step 3: Create `scripts/verify.js`**

```js
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function collectHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      collectHtmlFiles(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function verify() {
  const files = collectHtmlFiles(ROOT);
  let errors = 0;

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const relFromRoot = '/' + path.relative(ROOT, file).split(path.sep).join('/');

    if (!/<title>[^<]+<\/title>/.test(html)) {
      console.error(`[MISSING TITLE] ${relFromRoot}`);
      errors++;
    }
    if (!/rel="canonical"/.test(html)) {
      console.error(`[MISSING CANONICAL] ${relFromRoot}`);
      errors++;
    }
    if (/undefined|\[object Object\]/.test(html)) {
      console.error(`[TEMPLATE LEAK] ${relFromRoot}`);
      errors++;
    }

    const linkRegex = /(?:href|src)="(\/[^"#]+)"/g;
    let match;
    while ((match = linkRegex.exec(html))) {
      const linkPath = match[1];
      if (linkPath.startsWith('//')) continue;
      const targetFull = path.join(ROOT, linkPath);
      if (!fs.existsSync(targetFull)) {
        console.error(`[BROKEN LINK] ${relFromRoot} -> ${linkPath}`);
        errors++;
      }
    }

    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    while ((match = jsonLdRegex.exec(html))) {
      try {
        JSON.parse(match[1]);
      } catch (e) {
        console.error(`[INVALID JSON-LD] ${relFromRoot}`);
        errors++;
      }
    }
  }

  console.log(`Checked ${files.length} HTML files, ${errors} error(s).`);
  if (errors > 0) process.exit(1);
}

if (require.main === module) {
  verify();
}

module.exports = verify;
```

- [ ] **Step 4: Run the generator**

```bash
node scripts/generate.js
```

Expected output: `Generated 45 pages + sitemap.xml`

- [ ] **Step 5: Run verification**

```bash
node scripts/verify.js
```

Expected output: `Checked 45 HTML files, 0 error(s).` — if errors are reported, fix the referenced template/generator file and re-run Steps 4-5 until it passes.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate.js scripts/verify.js assets/js/main.js index.html products brands wholesale about contact sitemap.xml
git commit -m "Add generator/verify scripts, runtime JS, and build the full static site"
```

---

### Task 9: Visual QA pass and mobile check

**Files:**
- Modify: `assets/css/main.css` (only if QA finds issues)
- Modify: any `templates/*.js` or `scripts/pages/*.js` files if content/layout issues are found

**Interfaces:**
- No new interfaces — this task consumes the fully generated site from Task 8 and fixes what it finds.

- [ ] **Step 1: Serve the site locally for a visual check**

```bash
npx --yes serve -l 8080 .
```

(or copy the folder into XAMPP's `htdocs` and browse `http://localhost/Target/` if XAMPP's Apache is already running — this project already lives under `C:\xampp\htdocs\Target`, so `http://localhost/Target/` should work directly once Apache is started).

- [ ] **Step 2: Walk the spec's Visual QA checklist against the running site**

Check each, in a desktop width (~1440px) and a mobile width (~390px):
- Does this look like a generic hardware website? (should be no)
- Does the hero read as an asymmetric scattered composition, not a centered banner?
- Do product/category art blocks function visually like the DESIGN.md swatches (varied sizes, flat color, no shadow)?
- Is there enough whitespace (72px section gaps, generous padding)?
- Is Cobalt Command used only for actions/links, never as a large fill?
- Any shadows, gradients, or glow that crept in from browser defaults (e.g. default `<button>` styling, `<iframe>` border)? Remove/override them.
- Mobile: no horizontal scroll, bottom quick-action bar visible and usable, nav toggle opens/closes the panel, WhatsApp float doesn't overlap the quick-action bar.

- [ ] **Step 3: Fix any issues found**, editing the relevant template/CSS file, then re-run:

```bash
node scripts/generate.js && node scripts/verify.js
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "Visual QA pass: fix layout and mobile issues found during review"
```
