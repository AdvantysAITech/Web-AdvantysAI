// ===========================================================
// /solicitud — formulario único de contacto
//
// Paso 1: «¿Qué te interesa?» con todas las opciones visibles.
// Paso 2: solo se cargan los campos que aplican a esa opción.
// El envío lo construye window.advLead (assets/js/lead.js), que
// traduce el interés a línea de negocio, servicio, ruta, rol y
// spin-off con las etiquetas exactas de GHL.
//
// Parámetros de URL admitidos:
//   ?interes=consultoria|sistema|proyecto_ia|solucion_sectorial|invertir|iso42001|partners|otro
//   ?spinoff=educacion|hospitality|residencia|agro   (también Agro, Educación...)
//   ?role=Cliente Final|Inversor                      (enlaces antiguos)
//   ?origen=<página del CTA>
// ===========================================================
(() => {
  const form = document.getElementById('adv-solicitud-form');
  if (!form || !window.advLead) return;

  const L = window.advLead;

  // Solo iconos incluidos en assets/css/components/iconos.css (subset en línea)
  const ICONOS = {
    sistema: 'ph-gauge',
    consultoria: 'ph-calendar-check',
    proyecto_ia: 'ph-brain',
    solucion_sectorial: 'ph-buildings',
    invertir: 'ph-chart-bar',
    iso42001: 'ph-shield-check',
    partners: 'ph-handshake',
    otro: 'ph-paper-plane-tilt',
  };

  // Textos que cambian según el interés elegido
  const TEXTOS = {
    sistema:            { titulo: 'Automatiza tu negocio con el Sistema Advantys', sub: 'Déjanos tus datos y te llamamos para entender tus procesos y proponerte por dónde empezar.', mensaje: '¿Qué procesos te gustaría automatizar? (opcional)' },
    consultoria:        { titulo: 'Solicitar jornada de consultoría estratégica', sub: 'Nuestro equipo comercial te llamará para cerrar contigo el alcance, las áreas y la fecha de la jornada.', mensaje: '¿Qué áreas te interesa revisar? Marketing, venta, posventa, gestión... (opcional)' },
    proyecto_ia:        { titulo: 'Cuéntanos tu proyecto de IA', sub: 'Revisamos tu caso y te contactamos en menos de 24 h.', mensaje: 'Describe el proceso que quieres resolver con IA (opcional)' },
    solucion_sectorial: { titulo: 'Solicitar información de una solución sectorial', sub: 'Déjanos tus datos y agendamos una demo personalizada de la solución.', mensaje: '¿Qué te gustaría ver en la demo? (opcional)' },
    invertir:           { titulo: 'Quiero invertir en una spin-off de Advantys', sub: 'Déjanos tus datos y te enviamos el business case y las condiciones de participación.', mensaje: '¿Algo que debamos saber sobre tu perfil inversor? (opcional)' },
    iso42001:           { titulo: 'Implantar la ISO/IEC 42001', sub: 'Te contactamos para valorar tu punto de partida y el calendario hacia la certificación.', mensaje: '¿Usáis o desarrolláis sistemas de IA? Cuéntanos brevemente (opcional)' },
    otro:               { titulo: 'Hablemos de tu proyecto', sub: 'Déjanos tus datos y nuestro equipo se pondrá en contacto contigo en menos de 24h.', mensaje: 'Cuéntanos brevemente qué necesitas (opcional)' },
  };

  const $ = (id) => document.getElementById(id);

  const titleEl = $('solicitud-title');
  const subtitleEl = $('solicitud-subtitle');
  const contextEl = $('solicitud-context');
  const contextChip = $('solicitud-context-chip');
  const interesBox = $('solicitud-interes');
  const opcionesEl = $('solicitud-interes-opciones');
  const bloquePartners = $('solicitud-bloque-partners');
  const bloqueDatos = $('solicitud-bloque-datos');
  const bloqueSpinoff = $('solicitud-bloque-spinoff');
  const spinoffSelect = $('solicitud-spinoff');
  const spinoffLabel = $('solicitud-spinoff-label');
  const companyLabel = $('solicitud-company-label');
  const messageLabel = $('solicitud-message-label');
  const submitBtn = $('solicitud-submit');
  const feedback = $('solicitud-feedback');
  const honeypot = $('solicitud-website');

  const fields = {
    firstname: $('solicitud-firstname'),
    lastname: $('solicitud-lastname'),
    email: $('solicitud-email'),
    phone: $('solicitud-phone'),
    company: $('solicitud-company'),
    city: $('solicitud-city'),
    country: $('solicitud-country'),
    message: $('solicitud-message'),
  };

  const TITULO_INICIAL = titleEl.textContent;
  const SUB_INICIAL = subtitleEl.textContent.trim();

  // --- Antispam -----------------------------------------------------------
  // El webhook de GHL es público y cada ejecución cuesta dinero, así que
  // filtramos en cliente antes de gastar una llamada.
  const cargadoEn = Date.now();
  const MIN_SEGUNDOS = 3;
  const MAX_ENVIOS = 3;
  let enviosRealizados = 0;
  let envioUuid = L.nuevoUuid();

  // --- Parámetros de URL --------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const ORIGENES_VALIDOS = [
    'home', '404', 'blog', 'aviso-legal', 'politica-cookies', 'politica-privacidad',
    'autodiagnostico-iso-42001', 'consultoria-estrategica', 'sistema-advantys',
    'soluciones-ia', 'partners', 'iso-42001', 'educacion', 'hospitality',
    'residencia-fiscal', 'trazabilidad-agroalimentaria',
  ];
  const origen = ORIGENES_VALIDOS.includes(params.get('origen')) ? params.get('origen') : '';

  let interesUrl = params.get('interes');
  const roleUrl = params.get('role');
  if (!L.INTERESES[interesUrl] && roleUrl) {
    // Enlaces antiguos de las páginas de spin-off
    interesUrl = /inversor/i.test(roleUrl) ? 'invertir' : 'solucion_sectorial';
  }
  if (!L.INTERESES[interesUrl]) interesUrl = '';
  const spinoffUrl = L.claveSpinoff(params.get('spinoff'));

  // --- Pintar opciones de interés ------------------------------------------
  Object.entries(L.INTERESES).forEach(([clave, def]) => {
    const label = document.createElement('label');
    label.className = 'adv-solicitud-interes__opcion';
    label.innerHTML =
      `<input type="radio" name="interes" value="${clave}">` +
      `<i class="ph ${ICONOS[clave] || 'ph-circle'}" aria-hidden="true"></i>` +
      `<span>${def.texto}</span>`;
    opcionesEl.appendChild(label);
  });

  Object.entries(L.SPINOFF_NOMBRE).forEach(([clave, nombre]) => {
    const opt = document.createElement('option');
    opt.value = clave;
    opt.textContent = nombre;
    spinoffSelect.appendChild(opt);
  });

  const interesActual = () => {
    const r = form.querySelector('input[name="interes"]:checked');
    return r ? r.value : '';
  };

  // --- Mostrar solo lo que aplica al interés -------------------------------
  function aplicarInteres() {
    const clave = interesActual();
    const def = L.INTERESES[clave];

    interesBox.classList.remove('adv-solicitud-interes--error');
    const errInteres = document.querySelector('[data-error-for="solicitud-interes"]');
    if (errInteres) errInteres.textContent = '';

    if (!def) {
      bloqueDatos.hidden = true;
      bloquePartners.hidden = true;
      return;
    }

    if (clave === 'partners') {
      bloqueDatos.hidden = true;
      bloquePartners.hidden = false;
      titleEl.textContent = 'Programa de partners';
      subtitleEl.textContent = 'Colabora con Advantys como integrador, consultora o prescriptor.';
      contextEl.hidden = true;
      return;
    }

    bloquePartners.hidden = true;
    bloqueDatos.hidden = false;

    // Spin-off: solo para solución sectorial e inversión
    bloqueSpinoff.hidden = !def.requiereSpinoff;
    spinoffSelect.required = !!def.requiereSpinoff;
    if (!def.requiereSpinoff) spinoffSelect.value = '';
    spinoffLabel.textContent = clave === 'invertir'
      ? '¿En qué spin-off te interesa invertir?'
      : '¿Qué solución te interesa?';

    // Empresa: opcional para inversores (pueden ser particulares)
    const empresaOpcional = clave === 'invertir';
    fields.company.required = !empresaOpcional;
    companyLabel.textContent = empresaOpcional ? 'Empresa (opcional)' : 'Empresa';

    const t = TEXTOS[clave] || TEXTOS.otro;
    messageLabel.textContent = t.mensaje;
    actualizarCabecera();
  }

  function actualizarCabecera() {
    const clave = interesActual();
    if (!clave) {
      titleEl.textContent = TITULO_INICIAL;
      subtitleEl.textContent = SUB_INICIAL;
      contextEl.hidden = true;
      return;
    }
    const t = TEXTOS[clave] || TEXTOS.otro;
    const spin = spinoffSelect.value;
    const nombreSpin = spin ? L.SPINOFF_NOMBRE[spin] : '';

    if (clave === 'invertir' && nombreSpin) titleEl.textContent = `Quiero invertir en ${nombreSpin}`;
    else if (clave === 'solucion_sectorial' && nombreSpin) titleEl.textContent = `Solicitar información — ${nombreSpin}`;
    else titleEl.textContent = t.titulo;
    subtitleEl.textContent = t.sub;

    contextEl.hidden = false;
    contextChip.textContent = nombreSpin
      ? `${L.INTERESES[clave].texto} · ${nombreSpin}`
      : L.INTERESES[clave].texto;
  }

  opcionesEl.addEventListener('change', aplicarInteres);
  spinoffSelect.addEventListener('change', actualizarCabecera);

  // Preselección desde la URL (editable por el usuario)
  if (interesUrl) {
    const radio = form.querySelector(`input[name="interes"][value="${interesUrl}"]`);
    if (radio) radio.checked = true;
    if (spinoffUrl) spinoffSelect.value = spinoffUrl;
    aplicarInteres();
  }

  // --- Validación ---------------------------------------------------------
  function clearErrors() {
    form.querySelectorAll('.adv-form__error').forEach((el) => { el.textContent = ''; });
    form.querySelectorAll('.adv-form__input--error').forEach((el) => el.classList.remove('adv-form__input--error'));
    interesBox.classList.remove('adv-solicitud-interes--error');
  }

  function setError(id, message, input) {
    const el = document.querySelector(`[data-error-for="solicitud-${id}"]`);
    if (el) el.textContent = message;
    if (input) input.classList.add('adv-form__input--error');
  }

  function validate() {
    clearErrors();
    let valid = true;
    const clave = interesActual();
    const def = L.INTERESES[clave];

    if (!def) {
      interesBox.classList.add('adv-solicitud-interes--error');
      setError('interes', 'Elige una opción para continuar.');
      return false;
    }

    if (def.requiereSpinoff && !spinoffSelect.value) {
      setError('spinoff', 'Selecciona una opción.', spinoffSelect); valid = false;
    }
    if (fields.firstname.value.trim().length < 2) { setError('firstname', 'Introduce tu nombre.', fields.firstname); valid = false; }
    if (fields.lastname.value.trim().length < 2) { setError('lastname', 'Introduce tus apellidos.', fields.lastname); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) { setError('email', 'Introduce un email válido.', fields.email); valid = false; }
    if (fields.phone.value.replace(/[^\d]/g, '').length < 6) { setError('phone', 'Introduce un teléfono válido.', fields.phone); valid = false; }
    if (fields.company.required && fields.company.value.trim().length < 2) { setError('company', 'Introduce el nombre de tu empresa.', fields.company); valid = false; }
    if (fields.city.value.trim().length < 2) { setError('city', 'Introduce tu ciudad.', fields.city); valid = false; }
    if (!fields.country.value) { setError('country', 'Selecciona tu país.', fields.country); valid = false; }

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

  function reiniciar() {
    form.reset();
    aplicarInteres();
  }

  // --- Envío --------------------------------------------------------------
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) return;

    // Honeypot: si viene relleno es un bot. Fingimos éxito y no enviamos.
    if (honeypot && honeypot.value.trim() !== '') {
      reiniciar();
      showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.');
      return;
    }
    if ((Date.now() - cargadoEn) < MIN_SEGUNDOS * 1000) {
      showFeedback('error', 'Revisa los datos e inténtalo de nuevo.');
      return;
    }
    if (enviosRealizados >= MAX_ENVIOS) {
      showFeedback('error', 'Ya hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo.');
      return;
    }

    const payload = L.construir({
      uuid: envioUuid,
      formulario: 'Solicitud',
      origen,
      interes: interesActual(),
      spinoff: spinoffSelect.value,
      nombre: fields.firstname.value.trim(),
      apellidos: fields.lastname.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.phone.value.trim(),
      empresa: fields.company.value.trim(),
      ciudad: fields.city.value.trim(),
      pais: fields.country.value,
      pais_nombre: fields.country.options[fields.country.selectedIndex].textContent.trim(),
      mensaje: fields.message ? fields.message.value.trim() : '',
    });

    setLoading(true);
    feedback.textContent = '';

    try {
      await L.enviar(payload);
      enviosRealizados += 1;
      envioUuid = L.nuevoUuid();
      if (window.advTrack) window.advTrack('generate_lead', {
        formulario: 'solicitud',
        interes: payload.interes,
        linea_negocio: payload.linea_negocio || '(sin línea)',
        spinoff: payload.spinoff || '(ninguna)',
        rol_jv: payload.rol_jv || '(ninguno)',
        origen: origen || '(directo)',
      });
      reiniciar();
      showFeedback('success', '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en menos de 24 h.');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar el formulario. Inténtalo de nuevo en unos minutos.');
    } finally {
      setLoading(false);
    }
  });
})();
