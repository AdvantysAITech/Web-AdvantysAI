(() => {
  const WEBHOOK_URL = window.ADV_WEBHOOK_URL || 'https://TU-WEBHOOK-GHL.com/webhook/web-lead';

  const forms = document.querySelectorAll('.adv-vertical-cta__form');
  if (!forms.length) return;
  const nuevoUuid = () =>
    (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  forms.forEach(initForm);

  function initForm(form) {
    const submitBtn = form.querySelector('.adv-vertical-cta__submit');
    const feedback = form.querySelector('[data-feedback]');
    let envioUuid = nuevoUuid();

    const fieldNames = ['name', 'email', 'phone', 'company', 'location'];

    function field(name) {
      return form.querySelector(`[name="${name}"]`);
    }

    function clearErrors() {
      form.querySelectorAll('.adv-form__error').forEach((el) => { el.textContent = ''; });
      fieldNames.forEach((n) => field(n).classList.remove('adv-form__input--error'));
    }

    function setError(name, message) {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = message;
      field(name).classList.add('adv-form__input--error');
    }

    function validate() {
      clearErrors();
      let valid = true;

      if (field('name').value.trim().length < 3) {
        setError('name', 'Introduce tu nombre completo.');
        valid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field('email').value.trim())) {
        setError('email', 'Introduce un email válido.');
        valid = false;
      }

      const phoneDigits = field('phone').value.replace(/[^\d]/g, '');
      if (phoneDigits.length < 6) {
        setError('phone', 'Introduce un teléfono válido.');
        valid = false;
      }

      if (field('company').value.trim().length < 2) {
        setError('company', 'Introduce el nombre de tu empresa.');
        valid = false;
      }

      if (field('location').value.trim().length < 2) {
        setError('location', 'Introduce ciudad y país.');
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
        nombre: field('name').value.trim(),
        email: field('email').value.trim(),
        telefono: field('phone').value.trim(),
        empresa: field('company').value.trim(),
        ciudad_pais: field('location').value.trim(),
        linea_negocio: 'Joint Venture Builder',
        rol_jv: form.dataset.role,
        spinoff: form.dataset.spinoff,
        fuente: form.dataset.source || 'Web Advantys — Página Spin-off',
        servicio: '',
        modalidad: '',
        estado_presupuesto: '',
        uuid: envioUuid,
        calificacion: 'SIN_CALIFICAR',
        fase_entrada: 'Prospecto Identificado',
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
        envioUuid = nuevoUuid();
        showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
      } catch (err) {
        showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
      } finally {
        setLoading(false);
      }
    });
  }
})();