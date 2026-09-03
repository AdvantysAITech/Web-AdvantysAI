(() => {
  const WEBHOOK_URL = window.ADV_WEBHOOK_URL || 'https://n8n.advantys.ai/webhook/web-lead';

  const SPIN_OFFS = [
    { valor: 'Educación',   nombre: 'Advantys AI Educación' },
    { valor: 'Agro',        nombre: 'Advantys AI Trazabilidad Agroalimentaria' },
    { valor: 'Hospitality', nombre: 'Advantys AI Hospitality' },
    { valor: 'Residencia',  nombre: 'Advantys AI Residencia Fiscal' },
  ];

  const form = document.getElementById('adv-solicitud-form');
  if (!form) return;

  const nuevoUuid = () =>
    (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  let envioUuid = nuevoUuid();

  // --- Antispam -----------------------------------------------------------
  // El webhook de GHL es público y cada ejecución cuesta dinero, así que
  // filtramos en cliente antes de gastar una llamada.
  const cargadoEn = Date.now();
  const MIN_SEGUNDOS = 3;   // un humano no rellena 8 campos en menos de 3 s
  const MAX_ENVIOS = 3;     // tope por carga de página
  let enviosRealizados = 0;
  const honeypot = document.getElementById('solicitud-website');

  const params = new URLSearchParams(window.location.search);
  const urlRole = params.get('role');       // 'Cliente Final' | 'Inversor'
  const urlSpinoff = params.get('spinoff'); // nombre exacto de la spin-off
  const urlOrigen = params.get('origen');   // página desde la que se pulsó el CTA del footer

  // Solo se aceptan orígenes conocidos, para que no entre basura en GHL
  const ORIGENES_VALIDOS = [
    'home', '404', 'blog', 'aviso-legal', 'politica-cookies', 'politica-privacidad',
    'autodiagnostico-iso-42001', 'consultoria-estrategica', 'sistema-advantys',
    'soluciones-ia', 'partners', 'iso-42001', 'educacion', 'hospitality',
    'residencia-fiscal', 'trazabilidad-agroalimentaria',
  ];
  const origen = ORIGENES_VALIDOS.includes(urlOrigen) ? urlOrigen : '';

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
    firstname: document.getElementById('solicitud-firstname'),
    lastname: document.getElementById('solicitud-lastname'),
    email: document.getElementById('solicitud-email'),
    phone: document.getElementById('solicitud-phone'),
    company: document.getElementById('solicitud-company'),
    city: document.getElementById('solicitud-city'),
    country: document.getElementById('solicitud-country'),
  };

  // --- Poblar el select de Spin-offs (placeholder estático, sync GHL pendiente) ---
  SPIN_OFFS.forEach(({ valor, nombre }) => {
    const opt = document.createElement('option');
    opt.value = valor;
    opt.textContent = nombre;
    spinoffSelect.appendChild(opt);
  });

  // --- Actualiza título / subtítulo / chip según el Rol y Spin-off actuales ---
  function updateContext() {
    const role = roleSelect.value;
    const spinoff = spinoffSelect.value;

    if (!role || !spinoff) {
      contextEl.hidden = true;
      return;
    }

    // Para los textos visibles usamos el nombre comercial, no el identificador interno.
    const entry = SPIN_OFFS.find((s) => s.valor === spinoff);
    const label = entry ? entry.nombre : spinoff;

    contextEl.hidden = false;
    contextChip.textContent = `${label} · ${role}`;

    if (role === 'Inversor') {
      titleEl.textContent = `Quiero invertir en ${label}`;
      subtitleEl.textContent = 'Déjanos tus datos y te enviamos el business case y las condiciones de participación.';
    } else {
      titleEl.textContent = `Solicitar información — ${label}`;
      subtitleEl.textContent = 'Déjanos tus datos y agendamos una demo personalizada de la solución.';
    }
  }

  if (urlRole && urlSpinoff) {
    // --- Caso normal: viene de un botón "Solicitar demo" / "Quiero invertir" ---
    // Mostramos Rol y Spin-off YA preseleccionados, pero editables por si el usuario
    // quiere corregirlos (ej. llegó al enlace equivocado).
    fallbackRole.hidden = false;
    fallbackSpinoff.hidden = false;
    roleSelect.required = true;
    spinoffSelect.required = true;

    roleSelect.value = urlRole;
    spinoffSelect.value = urlSpinoff;

    updateContext();
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
      if (!isJv) {
        roleSelect.value = '';
        spinoffSelect.value = '';
        contextEl.hidden = true;
      }
    });
  }

  // Si el usuario cambia manualmente el Rol o la Spin-off (venga de URL o de fallback),
  // el título/subtítulo/chip se mantienen sincronizados.
  roleSelect.addEventListener('change', updateContext);
  spinoffSelect.addEventListener('change', updateContext);

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

    if (fields.firstname.value.trim().length < 2) { setError('firstname', 'Introduce tu nombre.'); valid = false; }
    if (fields.lastname.value.trim().length < 2) { setError('lastname', 'Introduce tus apellidos.'); valid = false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.value.trim())) { setError('email', 'Introduce un email válido.'); valid = false; }

    const phoneDigits = fields.phone.value.replace(/[^\d]/g, '');
    if (phoneDigits.length < 6) { setError('phone', 'Introduce un teléfono válido.'); valid = false; }

    if (fields.company.value.trim().length < 2) { setError('company', 'Introduce el nombre de tu empresa.'); valid = false; }
    if (fields.city.value.trim().length < 2) { setError('city', 'Introduce tu ciudad.'); valid = false; }
    if (!fields.country.value) { setError('country', 'Selecciona tu país.'); valid = false; }

    if (!fallbackLine.hidden && !lineSelect.value) valid = false;
    if (!fallbackRole.hidden) {
      if (!roleSelect.value) valid = false;
      if (!spinoffSelect.value) valid = false;
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

    // Honeypot: campo invisible para humanos. Si viene relleno es un bot.
    // Le enseñamos el mensaje de éxito para que no reintente, pero no enviamos.
    if (honeypot && honeypot.value.trim() !== '') {
      form.reset();
      showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
      return;
    }

    // Envío demasiado rápido tras cargar la página: casi con seguridad un script.
    if ((Date.now() - cargadoEn) < MIN_SEGUNDOS * 1000) {
      showFeedback('error', 'Revisa los datos e inténtalo de nuevo.');
      return;
    }

    // Tope de envíos por carga de página, para cortar bucles y clics repetidos.
    if (enviosRealizados >= MAX_ENVIOS) {
      showFeedback('error', 'Ya hemos recibido tu solicitud. Si necesitas algo más, escríbenos a info@advantys.ai.');
      return;
    }

    const isJv = !fallbackRole.hidden;

    const payload = {
      nombre: fields.firstname.value.trim(),
      apellidos: fields.lastname.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.phone.value.trim(),
      empresa: fields.company.value.trim(),
      ciudad: fields.city.value.trim(),
      pais: fields.country.value,
      pais_nombre: fields.country.options[fields.country.selectedIndex].textContent.trim(),
      linea_negocio: isJv ? 'Joint Venture Builder' : (lineSelect.value || 'Joint Venture Builder'),
      rol_jv: isJv ? roleSelect.value : '',
      spinoff: isJv ? spinoffSelect.value : '',
      fuente: origen
        ? `Web Advantys — Solicitud (${origen})`
        : 'Web Advantys — Página de solicitud',
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
      enviosRealizados += 1;
      envioUuid = nuevoUuid();
      if (window.advTrack) window.advTrack('generate_lead', {
        formulario: 'solicitud',
        linea_negocio: payload.linea_negocio,
        spinoff: payload.spinoff || '(ninguna)',
        rol_jv: payload.rol_jv || '(ninguno)',
        origen: origen || '(directo)',
      });
      showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.');
    } finally {
      setLoading(false);
    }
  });
})();