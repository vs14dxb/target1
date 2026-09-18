'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, waLink, hasLiveContact, isPlaceholder, renderMediaHero } = require('../../templates/partials.js');

function renderContact() {
  const message = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const phoneReady = hasLiveContact('phone');
  const whatsappReady = hasLiveContact('whatsapp');
  const emailReady = hasLiveContact('email');
  const body = `
${renderMediaHero({
  eyebrow: 'Call · WhatsApp · Visit',
  title: 'Talk to the counter.',
  text: 'Share the product, specification and quantity you need. We’ll help with availability and quotation.',
  image: '/assets/images/trade-counter-v2.webp',
  alt: 'Hardware trade counter and organized warehouse',
})}
<section class="wrap section">
  <h2>Contact us.</h2>
  <div class="split-2" style="margin-top:var(--spacing-32)">
    <div>
      <h3>${site.businessName}</h3>
      <p>${site.addressLine1}<br>${site.addressLine2}</p>
      ${phoneReady ? `<p>Phone: <a class="link-ghost" href="tel:${site.phone}">${site.phone}</a></p>` : ''}
      ${whatsappReady ? `<p>WhatsApp: <a class="link-ghost" href="${waLink(message)}">${site.whatsapp}</a></p>` : ''}
      ${emailReady ? `<p>Email: <a class="link-ghost" href="mailto:${site.email}">${site.email}</a></p>` : ''}
      ${!isPlaceholder(site.hours) ? `<p>Hours: ${site.hours}</p>` : '<p>Contact details and opening hours are being updated.</p>'}
      <div class="hero-actions" style="margin-top:var(--spacing-24)">
        ${phoneReady ? `<a class="btn btn-primary" href="tel:${site.phone}">Call Now</a>` : ''}
        ${whatsappReady ? `<a class="btn btn-outline" href="${waLink(message)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
        <a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}" target="_blank" rel="noopener">Get Directions</a>
        <a class="btn btn-outline" href="/wholesale/index.html">Request Quote</a>
      </div>
    </div>
    <iframe src="${site.mapEmbedSrc}" style="width:100%;height:320px;border:1px solid var(--color-ink-black);border-radius:var(--radius-cards)" loading="lazy" title="Map to ${site.businessName}"></iframe>
  </div>
</section>`;

  return renderPage({
    title: 'Contact — Target Contracting & Trading',
    description: 'Contact Target Contracting & Trading in Kadakkavoor, Thiruvananthapuram, Kerala for hardware enquiries and quotations.',
    canonical: '/contact/index.html',
    activePath: '/contact/index.html',
    bodyHtml: body,
    whatsappMessage: message,
    jsonLdBlocks: [{
      '@context': 'https://schema.org',
      '@type': 'HardwareStore',
      name: site.businessName,
      ...(phoneReady ? { telephone: site.phone } : {}),
      ...(emailReady ? { email: site.email } : {}),
      address: { '@type': 'PostalAddress', streetAddress: site.addressLine1, addressLocality: 'Thiruvananthapuram', addressRegion: 'Kerala', addressCountry: 'IN' },
    }],
  });
}

module.exports = renderContact;
