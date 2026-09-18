'use strict';

const { categories } = require('../data/catalogue.js');
const { site, publicUrl, renderHeader, renderMobileBar, renderFooter, renderWhatsappFloat } = require('./partials.js');

function makeInternalPathsRelative(html, canonical) {
  const directory = canonical.replace(/^\//, '').split('/').slice(0, -1);
  const rootPrefix = directory.length ? '../'.repeat(directory.length) : './';
  return html.replace(/((?:href|src|action)=")\/(?!\/)/g, `$1${rootPrefix}`);
}

function renderPage({ title, description, canonical, activePath, bodyHtml, jsonLdBlocks = [], whatsappMessage }) {
  const canonicalUrl = `${site.siteUrl}${publicUrl(canonical)}`;
  const jsonLd = jsonLdBlocks.map(block => `<script type="application/ld+json">${JSON.stringify(block)}</script>`).join('\n');
  const defaultMessage = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${site.siteUrl}/assets/images/paint-hero-v2.webp">
<meta property="og:image:width" content="1792">
<meta property="og:image:height" content="1024">
<meta property="og:image:alt" content="Paints, coatings and trade supplies from Target Trading & Contracting">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
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
  return makeInternalPathsRelative(html, canonical);
}

module.exports = { renderPage };
