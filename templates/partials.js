'use strict';

const site = require('../config/site.json');
const { renderArt } = require('./art.js');

// Converts an on-disk path into the public URL used for canonical/OG/sitemap/JSON-LD.
// '/index.html' -> '/', '/products/x/index.html' -> '/products/x/',
// '/products/x/y.html' -> unchanged (real files keep their .html).
function publicUrl(diskPath) {
  return String(diskPath).replace(/(^|\/)index\.html$/, '$1');
}

function waLink(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

function isPlaceholder(value) {
  return !value || /X{2,}|PLACEHOLDER|example\.com|confirm actual/i.test(String(value));
}

function hasLiveContact(kind) {
  return !isPlaceholder(site[kind]);
}

function renderHeader(activePath) {
  const links = [
    ['/products/index.html', 'Paints & Products'],
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
  <a class="wordmark" href="/index.html" aria-label="Target Trading &amp; Contracting — home"><img class="brand-logo" src="/assets/images/target-logo.png" alt="" width="2159" height="915"></a>
  <nav class="main-nav" aria-label="Primary">${navLinks}<a class="pill" href="/wholesale/index.html#quote">Get a Quote</a></nav>
  <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-panel">Menu</button>
</header>
<nav class="mobile-panel" id="mobile-panel" aria-label="Mobile">${navLinks}<a class="pill" href="/wholesale/index.html#quote">Get a Quote</a></nav>`;
}

const BAR_ICONS = {
  call: '<path d="M4.5 3.5h3.2l1.4 3.4-2 1.4a10.5 10.5 0 0 0 4.6 4.6l1.4-2 3.4 1.4v3.2a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 3 5.1a1.5 1.5 0 0 1 1.5-1.6Z"/>',
  whatsapp: '<path d="M3.5 17l1-3a6.5 6.5 0 1 1 2.5 2.4Z"/>',
  directions: '<path d="M10 2.75c2.9 0 5.25 2.3 5.25 5.1 0 3.6-5.25 9.4-5.25 9.4S4.75 11.45 4.75 7.85c0-2.8 2.35-5.1 5.25-5.1Z"/><circle cx="10" cy="7.85" r="2"/>',
  products: '<rect x="2.75" y="2.75" width="6" height="6" rx="1"/><rect x="11.25" y="2.75" width="6" height="6" rx="1"/><rect x="2.75" y="11.25" width="6" height="6" rx="1"/><rect x="11.25" y="11.25" width="6" height="6" rx="1"/>',
  quote: '<path d="M5 2.75h6.5L15 6.25v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13.5a1 1 0 0 1 1-1Z"/><path d="M11.25 2.75v3.5H15"/><path d="M6.75 10.5h6.5M6.75 13.5h4.5"/>',
};

function barIcon(name) {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${BAR_ICONS[name]}</svg>`;
}

function mapsDirectionsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;
}

function renderMobileBar() {
  const phoneReady = hasLiveContact('phone');
  const whatsappReady = hasLiveContact('whatsapp');
  return `
<nav class="mobile-bar" aria-label="Quick actions">
  <a href="${phoneReady ? `tel:${site.phone}` : '/contact/index.html'}">${barIcon('call')}<span>${phoneReady ? 'Call' : 'Contact'}</span></a>
  <a href="${whatsappReady ? waLink("Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.") : '/contact/index.html'}">${barIcon('whatsapp')}<span>${whatsappReady ? 'WhatsApp' : 'Enquire'}</span></a>
  <a href="${mapsDirectionsUrl()}" target="_blank" rel="noopener">${barIcon('directions')}<span>Directions</span></a>
  <a href="/products/index.html">${barIcon('products')}<span>Products</span></a>
  <a href="/wholesale/index.html">${barIcon('quote')}<span>Quote</span></a>
</nav>`;
}

function renderFooter(categories) {
  const catLinks = categories.slice(0, 6).map(c => `<a href="/products/${c.slug}/index.html">${c.name}</a>`).join('');
  const contactLines = [
    hasLiveContact('phone') ? `<a href="tel:${site.phone}">${site.phone}</a>` : '',
    hasLiveContact('email') ? `<a href="mailto:${site.email}">${site.email}</a>` : '',
    !isPlaceholder(site.hours) ? `<p>${site.hours}</p>` : '<p>Contact details and opening hours are being updated.</p>',
  ].filter(Boolean).join('');
  return `
<footer class="site-footer">
  <div class="footer-cta">
    <div class="wrap footer-cta-inner">
      <div><small>Paints · Hardware · Trade supply</small><h2>Planning a paint job or project?</h2></div>
      <a class="footer-cta-button" href="/wholesale/index.html#quote">Request a quote <span aria-hidden="true">→</span></a>
    </div>
  </div>
  <div class="footer-main">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <a href="/index.html" aria-label="Target Trading &amp; Contracting — home"><img src="/assets/images/target-logo.png" alt="" width="2159" height="915"></a>
        <p>Paints, coatings, hardware and practical trade supply for Kadakkavoor and the surrounding region.</p>
      </div>
      <div class="footer-contact">
        <h3>Visit or contact</h3>
        <address>${site.addressLine1}<br>${site.addressLine2}</address>
        ${contactLines}
        <a class="footer-direction" href="${mapsDirectionsUrl()}" target="_blank" rel="noopener">Get directions <span aria-hidden="true">↗</span></a>
      </div>
      <nav class="footer-links" aria-label="Product categories">
        <h3>Shop</h3>
        ${catLinks}
      </nav>
      <nav class="footer-links" aria-label="Footer navigation">
        <h3>Target</h3>
        <a href="/brands/index.html">Paint Brands</a>
        <a href="/wholesale/index.html">Wholesale</a>
        <a href="/about/index.html">About us</a>
        <a href="/contact/index.html">Contact</a>
      </nav>
    </div>
    <div class="wrap footer-bottom"><span>&copy; ${new Date().getFullYear()} ${site.businessName}</span><span>Paints, hardware &amp; trade supply · Kadakkavoor</span></div>
  </div>
</footer>`;
}

function renderWhatsappFloat(message) {
  if (!hasLiveContact('whatsapp')) return '';
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
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.siteUrl}${publicUrl(it.url)}`,
    })),
  };
  return { html, jsonLd };
}

function imageDimensions(image) {
  if (image.includes('/catalog/')) return [1000, 1000];
  if (image.includes('-v2')) return [1792, 1024];
  if (image.includes('paint-hero')) return [1792, 1024];
  if (image.includes('hero-banner')) return [1800, 768];
  return [1800, 675];
}

function renderMediaHero({ eyebrow, title, text, image, alt, actions = '' }) {
  const [width, height] = imageDimensions(image);
  return `
<section class="media-hero">
  <img src="${image}" alt="${alt}" width="${width}" height="${height}">
  <div class="media-hero-panel">
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h1>${title}</h1>
    ${text ? `<p>${text}</p>` : ''}
    ${actions}
  </div>
</section>`;
}

function renderCategoryCard(cat, featured) {
  return `
<a class="category-card${featured ? ' featured' : ''}" href="/products/${cat.slug}/index.html">
  <div class="art"><img src="${cat.image}" alt="${cat.name} product selection" loading="lazy" width="1000" height="1000"></div>
  <h3>${cat.name}</h3>
  <p>${cat.description}</p>
  <span class="link-ghost">Explore &rarr;</span>
</a>`;
}

function renderProductCard(product, categoryName, image) {
  return `
<a class="product-card" href="/products/${product.categorySlug}/${product.slug}.html">
  <div class="art"><img src="${image}" alt="${product.name}" loading="lazy" width="1000" height="1000"></div>
  <div class="body">
    <span class="cat-tag">${categoryName}</span>
    <h3 style="font-size:16px">${product.name}</h3>
    <p style="font-size:13px;color:var(--color-pencil-gray);margin:0">${product.shortSpec}</p>
    <span class="link-ghost">Enquire &rarr;</span>
  </div>
</a>`;
}

module.exports = {
  site, waLink, publicUrl, isPlaceholder, hasLiveContact, renderHeader, renderMobileBar, renderFooter,
  renderWhatsappFloat, renderBreadcrumb, renderMediaHero, renderCategoryCard, renderProductCard,
};
