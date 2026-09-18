# Target Contracting & Trading — Website Design Spec

Date: 2026-09-17

## Purpose

Build a production-quality marketing + catalogue website for **Target Contracting & Trading**, a hardware wholesale and trading business based in Kadakkavoor, Thiruvananthapuram, Kerala. The site must reinterpret the editorial "color-swatch catalogue" design language in `DESIGN.md` for a hardware/industrial-supply context — it must read as a premium, editorial product catalogue, not a generic hardware-shop template or e-commerce marketplace.

This is an **enquiry-driven catalogue**: no cart, no checkout, no pricing. Every product/category surface funnels to a quote request or WhatsApp enquiry.

## Constraints & Ground Rules

- No fabricated facts: no invented brands, prices, years of experience, certifications, testimonials, or dealership claims. Anything not supplied ships as a clearly labeled config placeholder.
- No real product photography exists yet — use placeholder imagery (see below) sized and composed like real photos so the layout doesn't change when real photos arrive.
- No real contact details exist yet — phone, WhatsApp number, email, hours, and map coordinates all live in one config file as obvious placeholders (e.g. `+91-XXXXXXXXXX`).
- Strict visual rules from the top-level request apply: no gradients, no glassmorphism, no drop shadows, no glow, no generic Bootstrap-style cards, no dark/light alternating sections, no heavy scroll animation.

## Tech Stack

Static HTML/CSS/vanilla JS, no build step, deployed directly under XAMPP/Apache (`C:\xampp\htdocs\Target`).

- `assets/css/tokens.css` — DESIGN.md tokens as CSS custom properties (colors, type scale, spacing, radii).
- `assets/css/main.css` — global reset, layout, and component styles.
- `assets/js/data.js` — catalogue data: categories, products, brands (plain JS arrays/objects).
- `assets/js/main.js` — mobile nav toggle, WhatsApp link construction, active-nav/breadcrumb helpers, small hover/reveal interaction hooks.
- `assets/img/` — placeholder SVG "product silhouette" blocks in DESIGN.md palette colors, sized per context (hero scatter, category cards, product cards, product detail).
- `config/site.json` — single source of truth for business name, address, phone, WhatsApp number, email, hours, map coordinates. All placeholder values, clearly marked.
- `sitemap.xml`, `robots.txt` at site root.

Fonts (legally available substitutes for the proprietary DESIGN.md fonts):
- **esbuild** (display) → **Archivo Expanded/Black** (Google Fonts) at tightened tracking, matching the 64px / -0.03em / 0.94 line-height spec.
- **ppsupply** (body/UI) → **Inter** at weights 100/300/400, -0.04em tracking at small sizes.
- **PPSupplyMonoLight** → **JetBrains Mono Light** for hex/spec/metadata text.

## Site Map

```
/                                     Homepage
/products/index.html                 All-products / category index
/products/<category>/index.html      Category page (10 categories from spec)
/products/<category>/<product>.html  Product detail page (2-3 sample products per category)
/brands/index.html                   Brand directory (placeholders)
/wholesale/index.html                B2B wholesale page
/about/index.html                    About page
/contact/index.html                  Contact page
sitemap.xml, robots.txt
```

Categories (from spec): Power Tools, Hand Tools, Plumbing, Electrical, Fasteners, Construction Tools, Safety Products, Adhesives & Chemicals, Building Hardware, General Hardware.

## Page-by-Page Design

### Global header/footer
- Header: quiet flex nav. Left = wordmark ("Target Contracting & Trading" in esbuild-substitute, small scale). Right = Products / Brands / Wholesale / About / Contact + "Get a Quote" pill button (Cobalt Command fill, white text, Ink Black border). No sticky shadow; if sticky, flat with a 1px bottom border only.
- Mobile: collapses to a toggle-revealed panel; fixed bottom quick-action bar with Call / WhatsApp / Directions / Products / Quote icons+labels (per spec's mobile priority list).
- Footer: address, phone/WhatsApp/email (from config), quick links, categories list, copyright. Sage Wash background, 1px Ink Black top border, no shadow.
- Floating WhatsApp button: bottom-right circular button, Cobalt Command fill, monoline WhatsApp glyph, no glow/pulse. Default message: wholesale enquiry text. Product pages override with product-specific prefilled text.

### Homepage
1. **Hero** — asymmetric CSS Grid composition. Headline "Built for the work. Supplied for the trade." in display type, left-aligned, supporting paragraph and two CTAs (Explore Products / Request a Quote) in one column; surrounding grid cells hold 5-6 placeholder product blocks (drill, wrench, pipe fittings, fasteners, tools, electrical) at varied spans (tall/wide/small) — same scattered-swatch logic as DESIGN.md's hero.
2. **Product Categories** — "Everything the job needs." Irregular grid (not 4-col uniform): 10 categories, image size/prominence varies (2-3 "featured" categories span 2 columns/rows, rest are standard cards). Each: image, name, one-line description, "Explore →" ghost link.
3. **Featured Products** — "From shelf to site." Uniform minimal product-card grid (image, name, brand placeholder, category, short spec line, "Enquire" ghost link/button). No prices.
4. **Wholesale** — "Buying for the job? Let's talk quantity." Full-bleed typographic band (Studio Ivory or Sage Wash surface), large text treatment, two CTAs (Request Wholesale Quote — primary button; WhatsApp Us — secondary/pill).
5. **Brands** — "Brands professionals trust." Row/grid of placeholder brand slots (bordered rectangles with "Brand" placeholder label), architecture ready for real logos.
6. **Why Target** — editorial 2-column or stacked text layout (not icon cards): Wholesale focused / Practical sourcing / Local supply / Easy enquiries, each a short heading + 1-sentence copy, separated by hairline borders.
7. **CTA/Contact strip** — short closing section with address line, Call Now / WhatsApp / Get Directions / Request Quote actions before footer.

### Products index (`/products/`)
List of all 10 categories in the same editorial scattered layout as the homepage category section (reused component), each linking to its category page.

### Category page (`/products/<category>/`)
- Breadcrumb: Products / <Category>
- Category heading + description
- Grid of products in that category (placeholder set of 3-4 per category) using the minimal product-card component
- Each card links to its product detail page

### Product detail page
- Breadcrumb: Products / <Category> / <Product Name>
- Large placeholder product image (tall format)
- Product name, brand (placeholder), category tag
- Description (generic, non-fabricated: "Specification details available on enquiry" style placeholder copy)
- Specifications list (placeholder rows, e.g. "Power source: —", clearly marked as TBD where no real spec exists)
- Quantity field (number input, cosmetic — no cart) + "Request Quote" button
- WhatsApp enquiry button with prefilled product-specific message
- BreadcrumbList + Product JSON-LD

### Wholesale page
Headline + copy per spec, Request Wholesale Quote form (name, company, phone/email, requirement text area — submits via `mailto:`/WhatsApp link since there's no backend), WhatsApp Us button.

### Brands page
Grid of placeholder brand tiles (bordered boxes, "Brand name placeholder" label), short intro copy noting real brand list to follow.

### About page
Short, factual paragraph introducing the business (name, location, hardware wholesale/trading focus) with clearly bracketed placeholders for anything not supplied (e.g. "[year established — TBD]" avoided entirely per spec — instead simply omit unsupported claims rather than showing a TBD placeholder in visible copy). Internal config placeholders only for contact-type facts, not fabricated narrative facts.

### Contact page
Address, phone, WhatsApp, email, hours (from config, placeholder values), embedded Google Map (iframe using placeholder coordinates/query for Kadakkavoor), Get Directions / Call Now / WhatsApp / Request Quote buttons, LocalBusiness JSON-LD.

## SEO

- Unique `<title>`/meta description per page targeting local intent phrases naturally (hardware wholesale Kadakkavoor, hardware supplier Thiruvananthapuram, etc.) — no keyword stuffing.
- OpenGraph tags per page; canonical URL per page.
- JSON-LD: LocalBusiness (home + contact), Product (product pages), BreadcrumbList (category + product pages).
- `sitemap.xml` listing all pages; `robots.txt` allowing all + sitemap reference.
- Semantic HTML throughout (header/nav/main/article/section/footer, proper heading hierarchy).

## Mobile Behavior

- Single-column stacking of scattered grids at narrow widths (defined breakpoints, no horizontal scroll).
- Fixed bottom quick-action bar: Call, WhatsApp, Directions, Products, Quote.
- Font sizes fluid via `clamp()` for display type; body text never below 15px equivalent.
- No overlapping images; touch targets ≥44px.

## Interactions

CSS-only where possible: image `transform: scale()` on hover/focus, link underline transitions, button fill/outline inversion on hover. No animation libraries, no parallax, no glow/bounce.

## Out of Scope (this iteration)

- Shopping cart / checkout / payment.
- Real product photography, real brand logos, real contact details (all placeholder, config-driven).
- CMS/backend — data lives in static JS/JSON files, structured so a future backend can replace it without a template rewrite.
- User accounts, reviews, search backend (a simple client-side filter/search on the products index may be added if time allows, not required).

## Testing / QA Plan

- Manual visual QA pass against the spec's "Visual QA" checklist (does it look generic? does photography read like swatches? enough whitespace? cobalt used sparingly?).
- Validate HTML (no unclosed tags, proper semantics).
- Check mobile widths (375px, 414px) for overflow.
- Verify all internal links resolve, sitemap matches actual pages, JSON-LD validates (schema.org shape correctness, not live testing tool).
- Confirm no fabricated content shipped (spot-check about/contact/brands copy against constraints above).
