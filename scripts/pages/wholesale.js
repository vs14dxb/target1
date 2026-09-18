'use strict';

const { renderPage } = require('../../templates/layout.js');
const { site, waLink, hasLiveContact, renderMediaHero } = require('../../templates/partials.js');

function renderWholesale() {
  const message = "Hi Target Contracting & Trading, I'd like to enquire about a bulk/wholesale requirement.";
  const emailReady = hasLiveContact('email');
  const whatsappReady = hasLiveContact('whatsapp');
  const body = `
${renderMediaHero({
  eyebrow: 'Wholesale & bulk supply',
  title: 'Buying for the job?<br>Let’s talk quantity.',
  text: 'Share the specification, quantity and delivery requirement. We’ll confirm availability and quotation.',
  image: '/assets/images/bulk-supply-v2.webp',
  alt: 'Bulk construction supplies staged for dispatch',
})}
<section class="wrap section" id="quote">
  <div class="split-2">
    <form id="wholesale-form" class="form-grid"${emailReady ? ` data-email="${site.email}"` : ''} aria-label="Wholesale quote request">
      <label for="w-name" style="font-size:13px;color:var(--color-pencil-gray)">Name</label>
      <input id="w-name" name="name" required>
      <label for="w-company" style="font-size:13px;color:var(--color-pencil-gray)">Company (optional)</label>
      <input id="w-company" name="company">
      <label for="w-contact" style="font-size:13px;color:var(--color-pencil-gray)">Phone or Email</label>
      <input id="w-contact" name="contact" required>
      <label for="w-req" style="font-size:13px;color:var(--color-pencil-gray)">Requirement</label>
      <textarea id="w-req" name="requirement" rows="5" placeholder="Products or paint system, brand preference, shade/finish, pack size, quantities and required date"></textarea>
      <div class="hero-actions">
        <button type="submit" class="btn btn-primary"${emailReady ? ` formaction="mailto:${site.email}"` : ' disabled'}>${emailReady ? 'Request Wholesale Quote' : 'Contact Details Pending'}</button>
        ${whatsappReady ? `<a id="whatsapp" class="btn btn-outline" href="${waLink(message)}" target="_blank" rel="noopener">WhatsApp Us</a>` : '<a class="btn btn-outline" href="/contact/index.html">Contact</a>'}
      </div>
    </form>
    <div class="why-list" style="grid-template-columns:1fr">
      <div class="why-item" style="border-top:none"><h3>Paint-system quotations</h3><p>List putty, primer, interior or exterior finish, shade references and expected quantities.</p></div>
      <div class="why-item"><h3>One supporting order</h3><p>Add rollers, brushes, masking, protection and the wider hardware needed for the job.</p></div>
      <div class="why-item"><h3>Availability confirmed</h3><p>We check the requested brand, pack size and quantity before confirming the quotation.</p></div>
    </div>
  </div>
</section>`;

  return renderPage({
    title: 'Wholesale — Target Contracting & Trading',
    description: 'Bulk and wholesale hardware enquiries for contractors and businesses from Target Contracting & Trading, Kadakkavoor.',
    canonical: '/wholesale/index.html',
    activePath: '/wholesale/index.html',
    bodyHtml: body,
    whatsappMessage: message,
  });
}

module.exports = renderWholesale;
