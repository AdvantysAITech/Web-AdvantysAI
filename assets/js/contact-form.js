(() => {
  // ===========================================================
  // CONFIG — sustituye por la URL real del webhook (n8n o GHL)
  // ===========================================================
  const WEBHOOK_URL = 'https://TU-INSTANCIA-N8N.com/webhook/web-lead';

  const form = document.getElementById('adv-contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('adv-contact-submit');
  const feedback = document.getElementById('adv-contact-feedback');

  const fields = {
    name: document.getElementById('contact-name'),
    email: document.getElementById('contact-email'),
    phone: document.getElementById('contact-phone'),
  };

  function clearErrors() {
    document.querySelectorAll('.adv-form__error').forEach((el) => {
      el.textContent = '';
    });
    Object.values(fields).forEach((f) => f.classList.remove('adv-form__input--error'));
  }

  function setError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="contact-${fieldName}"]`);
    if (el) el.textContent = message;
    fields[fieldName].classList.add('adv-form__input--error');
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();

    if (name.length < 3) {
      setError('name', 'Introduce tu nombre completo.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('email', 'Introduce un email válido.');
      valid = false;
    }

    const phoneDigits = phone.replace(/[^\d]/g, '');
    if (phoneDigits.length < 6) {
      setError('phone', 'Introduce un teléfono válido.');
      valid = false;
    }

    return valid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
  }

  function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.classList.remove('adv-contact-feedback--success', 'adv-contact-feedback--error');
    feedback.classList.add(type === 'success' ? 'adv-contact-feedback--success' : 'adv-contact-feedback--error');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      nombre: fields.name.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.phone.value.trim(),
      fuente: 'Web Advantys — Formulario de contacto',
      fecha: new Date().toISOString(),
    };

    setLoading(true);
    feedback.textContent = '';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      showFeedback('success', 'Gracias, hemos recibido tu solicitud. Te contactaremos en breve.');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
    } finally {
      setLoading(false);
    }
  });
})();