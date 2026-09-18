'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderCategoryCard, renderBreadcrumb, renderMediaHero } = require('../../templates/partials.js');
const { categories } = require('../../data/catalogue.js');

function renderProductsIndex() {
  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
  ]);

  const body = `
${crumbHtml}
${renderMediaHero({
  eyebrow: 'Paints, coatings & hardware',
  title: 'Start with colour.<br>Finish with the right tools.',
  text: 'Explore interior and exterior paints, surface preparation, wood and metal finishes, painting tools and our wider hardware range.',
  image: '/assets/images/paint-hero-v2.webp',
  alt: 'Paint showroom with colour display and professional advice',
})}
<section class="wrap section paint-guide">
  <div class="section-head"><div><span class="eyebrow">Choose by project</span><h2>Build the paint system, not just the colour.</h2></div></div>
  <div class="paint-guide-grid">
    <a href="/products/paints-coatings/interior-wall-paint.html"><span>01</span><h3>Interior walls</h3><p>Balance finish, washability, sheen and the way each room is used.</p></a>
    <a href="/products/paints-coatings/exterior-wall-paint.html"><span>02</span><h3>Exterior walls</h3><p>Choose protection around weather exposure, surface condition and maintenance.</p></a>
    <a href="/products/paints-coatings/wall-primer-putty.html"><span>03</span><h3>Surface preparation</h3><p>Start with the correct putty, primer and repair products for a lasting finish.</p></a>
    <a href="/products/paints-coatings/wood-metal-finishes.html"><span>04</span><h3>Wood &amp; metal</h3><p>Match the coating to the substrate, environment and required appearance.</p></a>
  </div>
</section>
<section class="wrap section">
  <div class="section-head"><h2>Shop by application.</h2><a class="link-ghost" href="/wholesale/index.html">Bulk requirement? Request a quote &rarr;</a></div>
  <div class="category-grid" style="margin-top:var(--spacing-32)">
    ${categories.map(c => renderCategoryCard(c, c.featured)).join('')}
  </div>
</section>`;

  return renderPage({
    title: 'Paints & Products — Target Trading & Contracting',
    description: 'Browse Asian Paints, Birla Opus, Berger, Indigo Paints, painting accessories, tools, plumbing, electrical supplies and hardware.',
    canonical: '/products/index.html',
    activePath: '/products/index.html',
    bodyHtml: body,
    jsonLdBlocks: [crumbLd],
  });
}

module.exports = renderProductsIndex;
