'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderProductCard, renderBreadcrumb, renderMediaHero } = require('../../templates/partials.js');
const { categories, products } = require('../../data/catalogue.js');

function renderCategoryPage(categorySlug) {
  const category = categories.find(c => c.slug === categorySlug);
  const catProducts = products.filter(p => p.categorySlug === categorySlug);
  const paintAdvice = categorySlug === 'paints-coatings' ? `
<section class="wrap section paint-advice">
  <div><span class="eyebrow">Before you choose</span><h2>Tell us what you’re painting.</h2></div>
  <div class="paint-advice-copy"><p>Bring the room or elevation size, current surface condition, preferred finish and colour direction. We can help you compare suitable systems across Asian Paints, Birla Opus, Berger and Indigo Paints.</p><p>Final product choice, coverage and quantity depend on the substrate and preparation required. Confirm the complete system before purchase.</p></div>
</section>` : '';

  const { html: crumbHtml, jsonLd: crumbLd } = renderBreadcrumb([
    { name: 'Home', url: '/index.html' },
    { name: 'Products', url: '/products/index.html' },
    { name: category.name, url: `/products/${category.slug}/index.html` },
  ]);

  const body = `
${crumbHtml}
${renderMediaHero({
  eyebrow: 'Product category',
  title: category.name,
  text: category.description,
  image: category.image,
  alt: `${category.name} selection`,
})}
${paintAdvice}
<section class="wrap section">
  <div class="section-head"><h2>Available products.</h2><a class="link-ghost" href="/wholesale/index.html">Request category quote &rarr;</a></div>
  <div class="product-grid" style="margin-top:var(--spacing-32)">
    ${catProducts.map(p => renderProductCard(p, category.name, category.image)).join('')}
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
