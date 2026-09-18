'use strict';

const fs = require('fs');
const path = require('path');
const { categories, products } = require('../data/catalogue.js');
const { site, publicUrl } = require('../templates/partials.js');

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
    write(`products/${product.categorySlug}/${product.slug}.html`, renderProductPage(product.categorySlug, product.slug));
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
${urls.map(u => `  <url><loc>${site.siteUrl}${publicUrl(u)}</loc></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

  const robots = `User-agent: *
Allow: /

Sitemap: ${site.siteUrl}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');

  console.log(`Generated ${urls.length} pages + sitemap.xml + robots.txt`);
  return urls;
}

if (require.main === module) {
  generate();
}

module.exports = generate;
