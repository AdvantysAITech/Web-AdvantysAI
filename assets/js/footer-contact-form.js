(() => {
  // ===========================================================
  // CONFIG — sustituye por la URL real del webhook de GHL
  // ===========================================================
  const WEBHOOK_URL = 'https://TU-WEBHOOK-GHL.com/webhook/web-lead-footer';

  // ===========================================================
  // PLACEHOLDER — listado de Spin-offs activas.
  // Sustituir por sincronización viva desde Sistema Advantys (GHL)
  // en cuanto Alex confirme el endpoint/mecanismo (ALR-10).
  // ===========================================================
  const SPIN_OFFS = [
    'Residencia Fiscal Soberana',
    'ROAT',
    'Trazabilidad Industrial',
    'IA con Criterio',
  ];

  const form = document.getElementById('adv-footer-contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('footer-contact-submit');
  const feedback = document.getElementById('footer-contact-feedback');
  const jvBlock = document.getElementById('footer-contact-jv-block');

  const fields = {
    name: document.getElementById('footer-contact-name'),
    email: document.getElementById('footer-contact-email'),
    phone: document.getElementById('footer-contact-phone'),
    company: document.getElementById('footer-contact-company'),
    location: document.getElementById('footer-contact-location'),
    line: document.getElementById('footer-contact-line'),
    role: document.getElementById('footer-contact-role'),
    spinoff: document.getElementById('footer-contact-spinoff'),
  };

  // --- Poblar el select de Spin-offs (placeholder estático) ---
  SPIN_OFFS.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    fields.spinoff.appendChild(opt);
  });

  // --- Mostrar/ocultar bloque JV según Línea de negocio ---
  function toggleJvBlock() {
    const isJv = fields.line.value === 'Joint Venture Builder';
    jvBlock.hidden = !isJv;
    fields.role.required = isJv;
    fields.spinoff.required = isJv;
    if (!isJv) {
      fields.role.value = '';
      fields.spinoff.value = '';
      clearErrors(['role', 'spinoff']);
    }
  }
  fields.line.addEventListener('change', toggleJvBlock);

  function clearErrors(only) {
    const targets = only || Object.keys(fields);
    targets.forEach((key) => {
      const el = document.querySelector(`[data-error-for="footer-contact-${key}"]`);
      if (el) el.textContent = '';
      if (fields[key]) fields[key].classList.remove('adv-form__input--error');
    });
  }

  function setError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="footer-contact-${fieldName}"]`);
    if (el) el.textContent = message;
    fields[fieldName].classList.add('adv-form__input--error');
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (fields.name.value.trim().length < 3) {
      setError('name', 'Introduce tu nombre completo.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.value.trim())) {
      setError('email', 'Introduce un email válido.');
      valid = false;
    }

    const phoneDigits = fields.phone.value.replace(/[^\d]/g, '');
    if (phoneDigits.length < 6) {
      setError('phone', 'Introduce un teléfono válido.');
      valid = false;
    }

    if (fields.company.value.trim().length < 2) {
      setError('company', 'Introduce el nombre de tu empresa.');
      valid = false;
    }

    if (fields.location.value.trim().length < 2) {
      setError('location', 'Introduce ciudad y país.');
      valid = false;
    }

    if (!fields.line.value) {
      setError('line', 'Selecciona una opción.');
      valid = false;
    }

    if (fields.line.value === 'Joint Venture Builder') {
      if (!fields.role.value) {
        setError('role', 'Selecciona un rol.');
        valid = false;
      }
      if (!fields.spinoff.value) {
        setError('spinoff', 'Selecciona una spin-off.');
        valid = false;
      }
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

    const isJv = fields.line.value === 'Joint Venture Builder';

    const payload = {
      nombre: fields.name.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.phone.value.trim(),
      empresa: fields.company.value.trim(),
      ciudad_pais: fields.location.value.trim(),
      linea_negocio: fields.line.value,
      rol_jv: isJv ? fields.role.value : null,
      spinoff: isJv ? fields.spinoff.value : null,
      fuente: 'Web Advantys — Footer',
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
      jvBlock.hidden = true;
      showFeedback('success', 'Gracias, hemos recibido tu solicitud. Te contactaremos en breve.');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
    } finally {
      setLoading(false);
    }
  });
})();