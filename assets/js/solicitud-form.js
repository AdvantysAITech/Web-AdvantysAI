(() => {
  const WEBHOOK_URL = window.ADV_WEBHOOK_URL || 'https://TU-WEBHOOK-GHL.com/webhook/web-lead';

  const SPIN_OFFS = [
    'Residencia Fiscal Soberana',
    'ROAT',
    'Trazabilidad Industrial',
    'IA con Criterio',
  ];

  const form = document.getElementById('adv-solicitud-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');       // 'Cliente Final' | 'Inversor'
  const spinoff = params.get('spinoff'); // nombre exacto de la spin-off

  const titleEl = document.getElementById('solicitud-title');
  const subtitleEl = document.getElementById('solicitud-subtitle');
  const contextEl = document.getElementById('solicitud-context');
  const contextChip = document.getElementById('solicitud-context-chip');

  const fallbackLine = document.getElementById('solicitud-fallback-line');
  const fallbackRole = document.getElementById('solicitud-fallback-role');
  const fallbackSpinoff = document.getElementById('solicitud-fallback-spinoff');
  const spinoffSelect = document.getElementById('solicitud-spinoff');
  const lineSelect = document.getElementById('solicitud-line');
  const roleSelect = document.getElementById('solicitud-role');

  const submitBtn = document.getElementById('solicitud-submit');
  const feedback = document.getElementById('solicitud-feedback');

  const fields = {
    name: document.getElementById('solicitud-name'),
    email: document.getElementById('solicitud-email'),
    phone: document.getElementById('solicitud-phone'),
    company: document.getElementById('solicitud-company'),
    location: document.getElementById('solicitud-location'),
  };

  let resolvedRole = role;
  let resolvedSpinoff = spinoff;

  if (role && spinoff) {
    // --- Caso normal: viene de un botón "Solicitar demo" / "Quiero invertir" ---
    contextEl.hidden = false;
    contextChip.textContent = `${spinoff} · ${role === 'Inversor' ? 'Inversor' : 'Cliente Final'}`;

    if (role === 'Inversor') {
      titleEl.textContent = `Quiero invertir en ${spinoff}`;
      subtitleEl.textContent = 'Déjanos tus datos y te enviamos el business case y las condiciones de participación.';
    } else {
      titleEl.textContent = `Solicitar información — ${spinoff}`;
      subtitleEl.textContent = 'Déjanos tus datos y agendamos una demo personalizada de la solución.';
    }
  } else {
    // --- Fallback: acceso directo sin parámetros ---
    fallbackLine.hidden = false;
    lineSelect.required = true;

    lineSelect.addEventListener('change', () => {
      const isJv = lineSelect.value === 'Joint Venture Builder';
      fallbackRole.hidden = !isJv;
      fallbackSpinoff.hidden = !isJv;
      roleSelect.required = isJv;
      spinoffSelect.required = isJv;
    });

    SPIN_OFFS.forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      spinoffSelect.appendChild(opt);
    });
  }

  function clearErrors() {
    form.querySelectorAll('.adv-form__error').forEach((el) => { el.textContent = ''; });
    Object.values(fields).forEach((f) => f.classList.remove('adv-form__input--error'));
  }

  function setError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="solicitud-${fieldName}"]`);
    if (el) el.textContent = message;
    fields[fieldName].classList.add('adv-form__input--error');
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (fields.name.value.trim().length < 3) { setError('name', 'Introduce tu nombre completo.'); valid = false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.value.trim())) { setError('email', 'Introduce un email válido.'); valid = false; }

    const phoneDigits = fields.phone.value.replace(/[^\d]/g, '');
    if (phoneDigits.length < 6) { setError('phone', 'Introduce un teléfono válido.'); valid = false; }

    if (fields.company.value.trim().length < 2) { setError('company', 'Introduce el nombre de tu empresa.'); valid = false; }
    if (fields.location.value.trim().length < 2) { setError('location', 'Introduce ciudad y país.'); valid = false; }

    if (!role || !spinoff) {
      if (!lineSelect.value) valid = false;
      if (lineSelect.value === 'Joint Venture Builder') {
        if (!roleSelect.value) valid = false;
        if (!spinoffSelect.value) valid = false;
        resolvedRole = roleSelect.value;
        resolvedSpinoff = spinoffSelect.value;
      } else {
        resolvedRole = null;
        resolvedSpinoff = null;
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

    const isJv = Boolean(resolvedRole && resolvedSpinoff);

    const payload = {
      nombre: fields.name.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.phone.value.trim(),
      empresa: fields.company.value.trim(),
      ciudad_pais: fields.location.value.trim(),
      linea_negocio: (role && spinoff) || isJv ? 'Joint Venture Builder' : (lineSelect ? lineSelect.value : 'Joint Venture Builder'),
      rol_jv: resolvedRole,
      spinoff: resolvedSpinoff,
      fuente: 'Web Advantys — Página de solicitud',
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
      showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
    } finally {
      setLoading(false);
    }
  });
})();