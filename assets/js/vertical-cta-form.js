(() => {
  // El envío lo construye window.advLead (assets/js/lead.js): mismas claves y
  // mismas etiquetas de GHL que el resto de formularios de la web.
  const forms = document.querySelectorAll('.adv-vertical-cta__form');
  if (!forms.length || !window.advLead) return;
  const L = window.advLead;
  const nuevoUuid = L.nuevoUuid;

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

      const esInversor = /inversor/i.test(form.dataset.role || '');
      const nombre = L.separarNombre(field('name').value);
      const payload = L.construir({
        uuid: envioUuid,
        formulario: esInversor ? 'CTA spin-off — Inversor' : 'CTA spin-off — Cliente',
        origen: form.dataset.origen || '',
        interes: esInversor ? 'invertir' : 'solucion_sectorial',
        spinoff: form.dataset.spinoff,
        nombre: nombre.nombre,
        apellidos: nombre.apellidos,
        email: field('email').value.trim(),
        telefono: field('phone').value.trim(),
        empresa: field('company').value.trim(),
        ciudad: field('location').value.trim(),
      });

      setLoading(true);
      feedback.textContent = '';

      try {
        await L.enviar(payload);

        form.reset();
        envioUuid = nuevoUuid();
        if (window.advTrack) window.advTrack('generate_lead', {
          formulario: 'cta_vertical',
          interes: payload.interes,
          linea_negocio: payload.linea_negocio,
          spinoff: payload.spinoff || '(ninguna)',
          rol_jv: payload.rol_jv || '(ninguno)',
        });
        showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
      } catch (err) {
        showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
      } finally {
        setLoading(false);
      }
    });
  }
})();