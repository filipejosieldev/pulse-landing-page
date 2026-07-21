/* ============================================================
   PULSE — Landing Page Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll effect ---------- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close menu on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  /* ---------- CTA Modal ---------- */
  const ctaBtn = document.getElementById('cta-main');
  const modal = document.getElementById('cta-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCtaLink = document.getElementById('modal-cta-link');

  function openModal() {
    modal.classList.add('visible');
  }

  function closeModal() {
    modal.classList.remove('visible');
  }

  ctaBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  modalCtaLink.addEventListener('click', () => {
    closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
  });

  /* ---------- ViaCEP API (inside contact form) ---------- */
  const cepInput = document.getElementById('contact-cep');
  const cepError = document.getElementById('cep-error');
  const cepResult = document.getElementById('cep-result');

  // Mask: 00000-000
  cepInput.addEventListener('input', () => {
    let value = cepInput.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    cepInput.value = value;

    // Auto-fetch when 8 digits typed
    const raw = value.replace(/\D/g, '');
    if (raw.length === 8) {
      fetchCep(raw);
    } else {
      cepResult.hidden = true;
      cepError.hidden = true;
    }
  });

  async function fetchCep(raw) {
    cepError.hidden = true;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);

      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();

      if (data.erro) {
        cepError.textContent = 'CEP não encontrado.';
        cepError.hidden = false;
        cepResult.hidden = true;
        return;
      }

      // Fill inline result
      document.getElementById('res-cidade').textContent = data.localidade || '—';
      document.getElementById('res-estado').textContent = data.uf || '—';
      cepResult.hidden = false;

    } catch (err) {
      cepError.textContent = 'Erro ao consultar o CEP.';
      cepError.hidden = false;
      cepResult.hidden = true;
    }
  }

  /* ---------- Contact Form ---------- */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const successName = document.getElementById('success-name');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    let valid = true;

    // Name validation
    if (!name.value.trim()) {
      document.getElementById('name-error').hidden = false;
      valid = false;
    } else {
      document.getElementById('name-error').hidden = true;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      document.getElementById('email-error').hidden = false;
      valid = false;
    } else {
      document.getElementById('email-error').hidden = true;
    }

    // Message validation
    if (!message.value.trim()) {
      document.getElementById('message-error').hidden = false;
      valid = false;
    } else {
      document.getElementById('message-error').hidden = true;
    }

    if (!valid) return;

    // Success
    successName.textContent = name.value.trim();
    form.hidden = true;
    formSuccess.hidden = false;

    // Reset form after showing success
    form.reset();
  });

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll(
    '.feature-card, .about-content, .about-visual'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Smooth scroll for nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
