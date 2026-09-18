'use strict';

const { renderPage } = require('../../templates/layout.js');
const { renderMediaHero } = require('../../templates/partials.js');

function renderAbout() {
  const body = `
${renderMediaHero({
  eyebrow: 'Kadakkavoor · Thiruvananthapuram',
  title: 'Colour expertise.<br>Practical trade supply.',
  text: 'Paints, coatings, tools and building essentials for homes, painters, contractors and businesses.',
  image: '/assets/images/trade-counter-v2.webp',
  alt: 'Paint specialist helping a customer choose colours',
})}
<section class="wrap section" style="max-width:900px">
  <h2>About Target Contracting &amp; Trading.</h2>
  <p style="margin-top:var(--spacing-24);font-size:var(--text-subheading)">Target Trading &amp; Contracting is a paint dealership and hardware business based in Kadakkavoor, Thiruvananthapuram. Paint is at the heart of our business, with Asian Paints, Birla Opus, Berger and Indigo Paints available alongside painting tools, hardware and building essentials.</p>
  <p>We help homeowners, painters and contractors think beyond a single tin: surface preparation, primer, finish, application tools and realistic quantities all matter to the result. For project and bulk requirements, share the full list so we can check the system together.</p>
  <div class="about-principles">
    <div><strong>Start with the surface</strong><span>New plaster, repainting, exterior exposure, wood and metal each need a different approach.</span></div>
    <div><strong>Compare the complete system</strong><span>We help compare paint, preparation and finish across our dealership brands.</span></div>
    <div><strong>Keep the project practical</strong><span>Confirm availability, quantity and application requirements before work begins.</span></div>
  </div>
</section>`;

  return renderPage({
    title: 'About — Target Contracting & Trading',
    description: 'Target Trading & Contracting is a paint dealership for Asian Paints, Birla Opus, Berger and Indigo Paints, with hardware and trade supplies in Kadakkavoor.',
    canonical: '/about/index.html',
    activePath: '/about/index.html',
    bodyHtml: body,
  });
}

module.exports = renderAbout;
