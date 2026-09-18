'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, waLink, hasLiveContact, isPlaceholder } = require('../../templates/partials.js');

function imageSize(image) {
  if (image.includes('/catalog/')) return [1000, 1000];
  if (image.includes('-v2')) return [1792, 1024];
  if (image.includes('paint-hero')) return [1792, 1024];
  if (image.includes('hero-banner')) return [1800, 768];
  return [1800, 675];
}

function imageTile({ cls = '', href, image, eyebrow, title, alt, primary = false }) {
  const [width, height] = imageSize(image);
  const heading = primary ? 'h1' : 'h2';
  return `
<a class="story-tile story-image ${cls}" href="${href}" aria-label="${title}">
  <img src="${image}" alt="${alt}" loading="lazy" width="${width}" height="${height}">
  <span class="story-caption"><small>${eyebrow}</small><${heading}>${title}</${heading}><span class="story-arrow" aria-hidden="true">→</span></span>
</a>`;
}

function colorTile({ cls = '', href, tone, eyebrow, title, text, footer = '' }) {
  return `
<a class="story-tile story-color ${tone} ${cls}" href="${href}" aria-label="${title}">
  <small>${eyebrow}</small><h2>${title}</h2>
  ${text ? `<p>${text}</p>` : ''}<span class="story-arrow" aria-hidden="true">→</span>
  ${footer ? `<span class="story-tile-footer">${footer}</span>` : ''}
</a>`;
}

function paintBrandBand() {
  const brands = [
    { name: 'Asian Paints', logo: '/assets/images/brands/asian-paints.avif', width: 205, height: 76 },
    { name: 'Birla Opus', logo: '/assets/images/brands/birla-opus.svg', width: 2804, height: 1201 },
    { name: 'Berger Paints', logo: '/assets/images/brands/berger-paints.png', width: 363, height: 99 },
    { name: 'Indigo Paints', logo: '/assets/images/brands/indigo-paints.svg', width: 170, height: 60 },
  ];
  return `
<section class="paint-brands story-span-12" aria-labelledby="paint-brands-title">
  <div class="paint-brands-head"><small>Our paint dealerships</small><h2 id="paint-brands-title">Four trusted names. One local store.</h2></div>
  <div class="paint-brand-list">
    ${brands.map(brand => `<a href="/brands/index.html" aria-label="Explore ${brand.name} at Target"><img src="${brand.logo}" alt="" width="${brand.width}" height="${brand.height}" loading="lazy"><span aria-hidden="true">→</span></a>`).join('')}
  </div>
</section>`;
}

function renderHome() {
  const ctaMessage = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const body = `
<section class="story-grid wrap" aria-label="Target hardware highlights">
  ${imageTile({ cls: 'story-span-8 story-tall', href: '/products/paints-coatings/index.html', image: '/assets/images/paint-hero-v2.webp', eyebrow: 'Colour advice · Paint systems · Project supply', title: 'The right colour starts with the right advice.', alt: 'Paint consultant helping homeowners and a painter compare colour samples', primary: true })}
  ${colorTile({ cls: 'story-span-4 story-tall story-shop', href: '/products/paints-coatings/index.html', tone: 'story-yellow', eyebrow: 'Start here', title: 'Explore paints', footer: 'Asian Paints · Birla Opus · Berger · Indigo' })}
  ${paintBrandBand()}
  ${imageTile({ cls: 'story-span-5', href: '/products/paints-coatings/index.html', image: '/assets/images/catalog/paint-v2.webp', eyebrow: 'Complete paint systems', title: 'Prepare, protect and finish properly', alt: 'Paint tins, primer, putty, colour samples and application tools on a workbench' })}
  ${imageTile({ cls: 'story-span-7', href: '/contact/index.html', image: '/assets/images/trade-counter-v2.webp', eyebrow: 'Local advice', title: 'Bring the list. Talk it through.', alt: 'Paint store expert reviewing a materials list with a contractor' })}
  ${imageTile({ cls: 'story-span-7 story-wide', href: '/wholesale/index.html', image: '/assets/images/bulk-supply-v2.webp', eyebrow: 'Project & bulk supply', title: 'Planned quantities. Practical fulfilment.', alt: 'Paint and contractor supplies being checked for a bulk order' })}
  ${colorTile({ cls: 'story-span-5 story-wide', href: '/wholesale/index.html#quote', tone: 'story-orange', eyebrow: 'Fast quotation', title: 'Send the list. We’ll source the fit.', text: 'Share the product, specification, quantity and delivery requirement.' })}
  ${imageTile({ cls: 'story-span-4', href: '/products/power-tools/index.html', image: '/assets/images/catalog/tools-v2.webp', eyebrow: 'Tools & accessories', title: 'Prepare and finish with confidence', alt: 'Professional power tools and hand tools on a workshop bench' })}
  ${imageTile({ cls: 'story-span-4', href: '/products/electrical/index.html', image: '/assets/images/catalog/electrical-v2.webp', eyebrow: 'Electrical', title: 'Installation essentials', alt: 'Electrical cable, switches, sockets and distribution equipment' })}
  ${imageTile({ cls: 'story-span-4', href: '/products/fasteners/index.html', image: '/assets/images/catalog/fasteners-v2.webp', eyebrow: 'Fasteners', title: 'The right fixing for the material', alt: 'Organized screws, bolts, nuts, washers and wall anchors' })}
  ${colorTile({ cls: 'story-span-5 story-wide', href: '/brands/index.html', tone: 'story-blue', eyebrow: 'Sourcing', title: 'Specify the job. We’ll source the fit.', text: 'Ask by application, specification or preferred manufacturer.' })}
  ${imageTile({ cls: 'story-span-7 story-wide', href: '/products/safety-products/index.html', image: '/assets/images/catalog/construction-safety-v2.webp', eyebrow: 'Site safety', title: 'Protection for the people doing the work', alt: 'Safety helmet, goggles, gloves and construction tools' })}
  ${imageTile({ cls: 'story-span-6', href: '/products/building-hardware/index.html', image: '/assets/images/catalog/building-maintenance-v2.webp', eyebrow: 'Building hardware', title: 'The details that finish the job', alt: 'Door hardware, sealants and maintenance supplies' })}
  ${colorTile({ cls: 'story-span-6', href: '/contact/index.html', tone: 'story-yellow', eyebrow: 'Kadakkavoor · Thiruvananthapuram', title: 'Talk to the counter', text: `${site.addressLine1}, ${site.addressLine2}.${isPlaceholder(site.hours) ? '' : ` ${site.hours}`}` })}
  <div class="story-contact story-span-12">
    <div><small>Need availability or pricing?</small><h2>Tell us what the job needs.</h2></div>
    <div class="hero-actions"><a class="btn btn-primary" href="/wholesale/index.html#quote">Request a Quote</a>${hasLiveContact('whatsapp') ? `<a class="btn btn-outline" href="${waLink(ctaMessage)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}<a class="btn btn-outline" href="/contact/index.html">Contact</a></div>
  </div>
</section>`;

  return renderPage({
    title: 'Target Trading & Contracting — Paint Dealer & Hardware Store, Kadakkavoor',
    description: 'Shop Asian Paints, Birla Opus, Berger and Indigo Paints, plus painting tools and hardware at Target Trading & Contracting in Kadakkavoor, Kerala.',
    canonical: '/index.html', activePath: '/index.html', bodyHtml: body,
    jsonLdBlocks: [{ '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: site.businessName, description: 'Paint dealership and hardware supplier in Kadakkavoor offering Asian Paints, Birla Opus, Berger and Indigo Paints.', address: { '@type': 'PostalAddress', addressLocality: 'Kadakkavoor', addressRegion: 'Kerala', addressCountry: 'IN' } }],
  });
}

module.exports = renderHome;
