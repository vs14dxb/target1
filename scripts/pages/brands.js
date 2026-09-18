'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderMediaHero } = require('../../templates/partials.js');

function renderBrands() {
  const paintBrands = [
    ['Asian Paints', '/assets/images/brands/asian-paints.avif', 205, 76, 'Interior and exterior finishes, primers, putties and specialist coatings.'],
    ['Birla Opus', '/assets/images/brands/birla-opus.svg', 2804, 1201, 'Decorative paints and complete surface solutions for contemporary spaces.'],
    ['Berger Paints', '/assets/images/brands/berger-paints.png', 363, 99, 'Interior, exterior and protective paint systems for homes and projects.'],
    ['Indigo Paints', '/assets/images/brands/indigo-paints.svg', 170, 60, 'Decorative and differentiated coatings for walls, wood and metal.'],
  ];
  const body = `
${renderMediaHero({
  eyebrow: 'Authorised paint dealerships',
  title: 'Trusted paint brands.<br>One local destination.',
  text: 'Explore paint and coating options from Asian Paints, Birla Opus, Berger and Indigo Paints.',
  image: '/assets/images/paint-hero-v2.webp',
  alt: 'Paint showroom with an extensive colour display',
})}
<section class="wrap section">
  <div class="section-head"><h2>Our paint dealerships.</h2></div>
  <p style="max-width:720px">Compare colours, finishes and coating systems across four leading paint brands. Visit the store or send your requirement for product and shade availability.</p>
  <div class="brand-grid paint-brand-grid" style="margin-top:var(--spacing-32)">
    ${paintBrands.map(([name, logo, width, height, description]) => `<div class="brand-tile sourcing-tile paint-brand-card"><img src="${logo}" alt="${name} logo" width="${width}" height="${height}" loading="lazy"><strong>${name}</strong><span>${description}</span></div>`).join('')}
  </div>
  <div class="hero-actions" style="margin-top:var(--spacing-32)"><a class="btn btn-primary" href="/wholesale/index.html">Request Paint Availability</a><a class="btn btn-outline" href="/products/paints-coatings/index.html">Browse Paints</a></div>
</section>`;

  return renderPage({
    title: 'Paint Brands — Target Trading & Contracting',
    description: 'Target Trading & Contracting supplies Asian Paints, Birla Opus, Berger and Indigo Paints in Kadakkavoor, Kerala.',
    canonical: '/brands/index.html',
    activePath: '/brands/index.html',
    bodyHtml: body,
  });
}

module.exports = renderBrands;
