'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, renderBreadcrumb, waLink, hasLiveContact } = require('../../templates/partials.js');
const { categories, products } = require('../../data/catalogue.js');

function attr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function renderProductPage(categorySlug, productSlug) {
  const product = products.find(p => p.categorySlug === categorySlug && p.slug === productSlug);
  if (!product) {
    throw new Error(`renderProductPage: no product found for ${categorySlug}/${productSlug}`);
  }
  const category = categories.find(c => c.slug === product.categorySlug);

  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
    { name: category.name, url: `/products/${category.slug}/index.html` },
    { name: product.name, url: `/products/${category.slug}/${product.slug}.html` },
  ]);

  const enquiryMessage = `Hi Target Contracting & Trading, I'm interested in ${product.name}. Could you please share availability and pricing?`;
  const whatsappReady = hasLiveContact('whatsapp');
  const isPaint = product.categorySlug === 'paints-coatings';
  const intro = isPaint
    ? `Tell us the surface, approximate area, current condition and finish you prefer. We’ll help compare suitable options from our dealership ranges and confirm the primer, preparation products and estimated quantity required.`
    : `Share the application, required size or specification and quantity. We’ll confirm suitable options, current availability and pricing before you buy.`;

  const specs = [
    ['Category', category.name],
    ['Specification', product.shortSpec],
    ['Brand', isPaint ? 'Asian Paints · Birla Opus · Berger · Indigo' : 'Options confirmed on enquiry'],
    ['Selection', isPaint ? 'Matched to surface, finish and budget' : 'Matched to the intended application'],
    ['Availability', 'Confirmed at the time of enquiry'],
  ];

  const body = `
${crumbHtml}
<section class="wrap section split-2" style="border-top:none">
  <div class="product-visual"><img src="${category.image}" alt="${product.name}" width="1000" height="1000"></div>
  <div>
    <span class="cat-tag">${category.name}</span>
    <h1 style="font-size:clamp(28px,5vw,44px);margin-top:var(--spacing-8)">${product.name}</h1>
    <p style="margin-top:var(--spacing-16)">${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:var(--spacing-24) 0">
      ${specs.map(([label, value]) => `<tr><td style="padding:8px 0;border-top:1px solid var(--color-sage-wash);color:var(--color-pencil-gray);font-size:13px">${label}</td><td style="padding:8px 0;border-top:1px solid var(--color-sage-wash);text-align:right">${value}</td></tr>`).join('')}
    </table>
    <form id="product-quote-form" class="form-grid" data-product-name="${attr(product.name)}"${whatsappReady ? ` data-wa-base="https://wa.me/${attr(site.whatsapp)}" data-wa-message="${attr(enquiryMessage)}"` : ''} aria-label="Request a quote">
      <label for="qty" style="font-size:13px;color:var(--color-pencil-gray)">Quantity</label>
      <input type="number" id="qty" name="qty" min="1" value="1">
      ${isPaint ? '<p class="form-note">Not sure of the quantity? Share the approximate wall area and number of coats when you contact us.</p>' : ''}
      <div class="hero-actions">
        <button type="submit" class="btn btn-primary"${whatsappReady ? '' : ' disabled'}>${whatsappReady ? 'Request Quote' : 'Contact Details Pending'}</button>
        ${whatsappReady ? `<a class="btn btn-outline" href="${waLink(enquiryMessage)}" target="_blank" rel="noopener">WhatsApp Enquiry</a>` : '<a class="btn btn-outline" href="/contact/index.html">Contact</a>'}
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
