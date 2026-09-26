(() => {
  const state = { tipo: null, cartera: null, modalidad: null };

  const RECOMMENDED = {
    consultoria: 'referidor',
    independiente: 'referidor',
    agencia: 'integrador',
    software: 'integrador',
  };

  const LABELS = {
    tipo: {
      consultoria: 'Consultoría de Negocio',
      agencia: 'Agencia Tecnológica / Integrador',
      software: 'Fabricante de Software (ISV)',
      independiente: 'Consultor Independiente',
    },
    cartera: {
      micro: 'Menos de 10 clientes',
      small: '10 – 50 clientes',
      medium: '50 – 200 clientes',
      large: 'Más de 200 clientes',
    },
    modalidad: {
      referidor: 'Partner Referidor',
      integrador: 'Partner Integrador',
    },
  };

  function tierLabel(tipo, cartera, modalidad) {
    if (modalidad === 'integrador') {
      return cartera === 'large' || cartera === 'medium'
        ? 'Tier Platinum — Integrador estratégico'
        : 'Tier Gold — Integrador certificado';
    }
    return cartera === 'large' || cartera === 'medium'
      ? 'Tier Gold — Referidor consolidado'
      : 'Tier Silver — Referidor en desarrollo';
  }

  function goToStep(n) {
    document.querySelectorAll('.adv-form-panel').forEach((p, i) => {
      p.classList.toggle('adv-form-panel--hidden', i + 1 !== n);
    });
    document.querySelectorAll('.adv-steps__item').forEach((el) => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('adv-steps__item--active', s === n);
      el.classList.toggle('adv-steps__item--done', s < n);
    });
  }

  function checkStep2Ready() {
    const btn = document.getElementById('btn-next-2');
    if (btn) btn.disabled = !(state.cartera && state.modalidad);
  }

  function checkStep3Ready() {
    const nombre = document.getElementById('input-nombre')?.value.trim();
    const email = document.getElementById('input-email')?.value.trim();
    const privacy = document.getElementById('input-privacy')?.checked;
    const btn = document.getElementById('btn-submit');
    if (btn) btn.disabled = !(nombre && email && privacy);
  }

  function populateSummary() {
    document.getElementById('sum-tipo').textContent =
      LABELS.tipo[state.tipo] ?? '—';
    document.getElementById('sum-cartera').textContent =
      LABELS.cartera[state.cartera] ?? '—';
    document.getElementById('sum-modalidad').textContent =
      LABELS.modalidad[state.modalidad] ?? '—';
    document.getElementById('sum-tier-label').textContent = tierLabel(
      state.tipo,
      state.cartera,
      state.modalidad
    );
  }

  function applyRecommendation() {
    const rec = RECOMMENDED[state.tipo];
    document.querySelectorAll('.adv-modalidad-card__rec').forEach((el) =>
      el.classList.remove('adv-modalidad-card__rec--visible')
    );
    if (rec) {
      document.getElementById('rec-' + rec)?.classList.add('adv-modalidad-card__rec--visible');
    }
  }

  // Step 1 — Tipo de empresa
  document.querySelectorAll('.adv-tipo-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.adv-tipo-card').forEach((c) =>
        c.classList.remove('adv-tipo-card--selected')
      );
      card.classList.add('adv-tipo-card--selected');
      state.tipo = card.dataset.value;
      document.getElementById('input-tipo-empresa').value = state.tipo;
      setTimeout(() => {
        goToStep(2);
        applyRecommendation();
      }, 260);
    });
  });

  // Step 2 — Cartera pills
  document.querySelectorAll('.adv-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.adv-pill').forEach((p) =>
        p.classList.remove('adv-pill--selected')
      );
      pill.classList.add('adv-pill--selected');
      state.cartera = pill.dataset.value;
      document.getElementById('input-cartera').value = state.cartera;
      checkStep2Ready();
    });
  });

  // Step 2 — Modalidad cards
  document.querySelectorAll('.adv-modalidad-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.adv-modalidad-card').forEach((c) =>
        c.classList.remove('adv-modalidad-card--selected')
      );
      card.classList.add('adv-modalidad-card--selected');
      state.modalidad = card.dataset.value;
      document.getElementById('input-modalidad').value = state.modalidad;
      checkStep2Ready();
    });
  });

  // Step 2 — Navigation
  document.getElementById('btn-back-1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('btn-next-2')?.addEventListener('click', () => {
    populateSummary();
    goToStep(3);
  });

  // Step 3 — Field validation
  ['input-nombre', 'input-email'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', checkStep3Ready);
  });
  document.getElementById('input-privacy')?.addEventListener('change', checkStep3Ready);

  // Step 3 — Back
  document.getElementById('btn-back-2')?.addEventListener('click', () => goToStep(2));

  // El envío lo construye window.advLead (assets/js/lead.js).
  const L = window.advLead;
  const nuevoUuid = L ? L.nuevoUuid : () => `web-${Date.now()}`;

  let envioUuid = nuevoUuid();

  const partnersForm = document.getElementById('partners-form');
  const submitBtn = document.getElementById('btn-submit');
  const feedbackEl = document.getElementById('partners-feedback');

  function showFeedback(type, message) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('adv-contact-feedback--success', 'adv-contact-feedback--error');
    feedbackEl.classList.add(type === 'success' ? 'adv-contact-feedback--success' : 'adv-contact-feedback--error');
  }

  partnersForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = L.separarNombre(document.getElementById('input-nombre').value);
    const payload = L.construir({
      uuid: envioUuid,
      formulario: 'Programa de Partners',
      origen: 'partners',
      interes: 'partners',
      nombre: nombre.nombre,
      apellidos: nombre.apellidos,
      email: document.getElementById('input-email').value.trim(),
      extra: {
        tipo_contacto: 'Partner',
        // --- Cualificación específica del canal de partners ---
        partner_tipo: LABELS.tipo[state.tipo] ?? '',
        partner_cartera: LABELS.cartera[state.cartera] ?? '',
        partner_modalidad: LABELS.modalidad[state.modalidad] ?? '',
        partner_tier: tierLabel(state.tipo, state.cartera, state.modalidad),
      },
    });

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    showFeedback('success', '');

    try {
      await L.enviar(payload);

      envioUuid = nuevoUuid();

      if (window.advTrack) window.advTrack('generate_lead', {
        formulario: 'partners',
        linea_negocio: 'Programa de Partners',
        partner_modalidad: payload.partner_modalidad,
        partner_tier: payload.partner_tier,
      });

      const panel = document.getElementById('adv-step-3');
      const success = document.getElementById('adv-success');
      panel.querySelectorAll(':scope > *:not(#adv-success)').forEach((el) => {
        el.style.display = 'none';
      });
      success?.classList.remove('adv-form-panel--hidden');
    } catch (err) {
      showFeedback('error', 'No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a soporte@advantys.ai.');
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
    }
  });
})();
