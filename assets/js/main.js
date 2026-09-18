(function () {
  /* Mobile nav toggle */
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Progressive scroll reveals; content remains visible when JS is unavailable. */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = document.querySelectorAll('.section, .wholesale-band');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    revealItems.forEach(function (item) { item.classList.add('reveal'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  }

  function value(form, name) {
    var field = form.elements[name];
    return field && field.value ? String(field.value).trim() : '';
  }

  /* Wholesale quote form -> mailto: */
  var wholesaleForm = document.getElementById('wholesale-form');
  if (wholesaleForm) {
    wholesaleForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = wholesaleForm.getAttribute('data-email') || '';
      if (!email) {
        /* Fall back to the submit button's formaction (mailto:...) if present. */
        var submitBtn = wholesaleForm.querySelector('[formaction^="mailto:"]');
        if (submitBtn) {
          email = submitBtn.getAttribute('formaction').replace(/^mailto:/, '');
        }
      }
      if (!email) return;

      var name = value(wholesaleForm, 'name');
      var company = value(wholesaleForm, 'company');
      var contact = value(wholesaleForm, 'contact');
      var requirement = value(wholesaleForm, 'requirement');

      var subject = 'Wholesale quote request' + (name ? ' from ' + name : '');
      var bodyLines = [
        'Name: ' + name,
        'Company: ' + (company || '-'),
        'Phone or Email: ' + contact,
        '',
        'Requirement:',
        requirement || '-'
      ];

      window.location.href = 'mailto:' + email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));
    });
  }

  /* Product quote form -> WhatsApp with quantity */
  var quoteForm = document.getElementById('product-quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var base = quoteForm.getAttribute('data-wa-base') || '';
      var message = quoteForm.getAttribute('data-wa-message') || '';

      if (!base || !message) {
        /* Fall back to the WhatsApp Enquiry link on the same page. */
        var waAnchor = document.querySelector('a[href^="https://wa.me/"]');
        if (!waAnchor) return;
        var parts = waAnchor.getAttribute('href').split('?text=');
        base = base || parts[0];
        if (!message && parts[1]) {
          message = decodeURIComponent(parts[1].replace(/\+/g, ' '));
        }
      }
      if (!base) return;

      var qty = value(quoteForm, 'qty');
      var fullMessage = message + (qty ? ' (Quantity: ' + qty + ')' : '');

      window.location.href = base + '?text=' + encodeURIComponent(fullMessage);
    });
  }
})();
