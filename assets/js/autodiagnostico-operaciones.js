/* =========================================
   AUTODIAGNÓSTICO DE OPERACIONES
   15 frases puntuadas 0/1/2 → puntuación sobre 30, franja y áreas.
   Calculadora «Ponle precio» y envío del resultado como lead.
   ========================================= */
(function () {
  const form = document.getElementById('adv-ado-form');
  if (!form) return;

  const BLOQUES = ['Flujo de trabajo', 'Datos y decisiones', 'Personas y dependencias', 'Sistemas', 'Cliente y cobro'];
  const FRANJAS = [
    { max: 8, tag: 'Operación sana', titulo: 'Tu empresa funciona con orden',
      texto: 'Hay pocas señales de pérdida. Lo más rentable ahora es atacar la mejora que más se repite cada día: pequeña, medible y con retorno rápido.' },
    { max: 18, tag: 'Pérdidas silenciosas', titulo: 'Es el resultado más habitual',
      texto: 'Varias fricciones del día a día probablemente te cuestan miles de euros al año sin aparecer en ningún informe. Merece la pena medirlas antes de comprar ninguna herramienta.' },
    { max: 30, tag: 'Crecer te está saliendo caro', titulo: 'Tu operación depende demasiado de personas, hojas de cálculo y papel',
      texto: 'Cada pedido nuevo añade trabajo manual. Antes de crecer más, conviene ordenar los procesos que más se repiten y decidir qué automatizar primero.' },
  ];

  const preguntas = Array.from(form.querySelectorAll('.adv-ado-q'));
  const bar = document.getElementById('adv-ado-bar');
  const count = document.getElementById('adv-ado-count');
  const ver = document.getElementById('adv-ado-ver');
  const resultado = document.getElementById('resultado');
  let ultimo = null;

  const respuestas = () => preguntas.map((q) => {
    const r = q.querySelector('input:checked');
    return r ? Number(r.value) : null;
  });

  form.addEventListener('change', () => {
    const hechas = respuestas().filter((v) => v !== null).length;
    bar.style.width = `${(hechas / preguntas.length) * 100}%`;
    count.textContent = `${hechas} de ${preguntas.length} respondidas`;
    ver.disabled = hechas < preguntas.length;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const r = respuestas();
    if (r.some((v) => v === null)) return;
    const total = r.reduce((a, b) => a + b, 0);
    const porBloque = BLOQUES.map((_, i) => r.slice(i * 3, i * 3 + 3).reduce((a, b) => a + b, 0));
    const franja = FRANJAS.find((f) => total <= f.max);
    ultimo = { total, porBloque, franja };

    document.getElementById('adv-ado-total').textContent = total;
    document.getElementById('adv-ado-band-tag').textContent = franja.tag;
    document.getElementById('adv-ado-band-title').textContent = franja.titulo;
    document.getElementById('adv-ado-band-text').textContent = franja.texto;

    const areas = document.getElementById('adv-ado-areas');
    const peor = Math.max(...porBloque);
    areas.innerHTML = '';
    BLOQUES.forEach((nombre, i) => {
      const v = porBloque[i];
      const fila = document.createElement('div');
      fila.className = 'adv-ado-area' + (v === peor && v > 0 ? ' adv-ado-area--peor' : '');
      fila.innerHTML = '<span class="adv-ado-area__name"></span><span class="adv-ado-area__track"><span class="adv-ado-area__fill"></span></span><span class="adv-ado-area__val"></span>';
      fila.querySelector('.adv-ado-area__name').textContent = nombre;
      fila.querySelector('.adv-ado-area__val').textContent = `${v}/6`;
      areas.appendChild(fila);
      requestAnimationFrame(() => { fila.querySelector('.adv-ado-area__fill').style.width = `${(v / 6) * 100}%`; });
    });

    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.advTrack) window.advTrack('autodiagnostico_completado', { puntuacion: total, franja: franja.tag });
  });

  // --- Ponle precio ---------------------------------------------------------
  const calc = (k) => Number(document.querySelector(`[data-calc="${k}"]`).value) || 0;
  const euros = document.getElementById('adv-ado-euros');
  const fmt = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
  const recalcular = () => {
    const v = (calc('min') * calc('veces') * calc('personas') * calc('dias') * calc('hora')) / 60;
    euros.textContent = `${fmt.format(Math.round(v))} €`;
    return Math.round(v);
  };
  document.querySelectorAll('[data-calc]').forEach((i) => i.addEventListener('input', recalcular));
  recalcular();

  // --- Envío del resultado ----------------------------------------------------
  const lead = document.getElementById('adv-ado-lead');
  const L = window.advLead;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PDF = 'https://assets.cdn.filesafe.space/tT0GAvtx8iOs64cDrzg2/media/6ae763cb36aa4a07e8be18b1.pdf';

  const err = (c, t) => {
    const el = lead.querySelector(`[data-error-for="${c}"]`);
    if (el) el.textContent = t || '';
  };

  lead.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(lead);
    const nombre = String(d.get('nombre') || '').trim();
    const email = String(d.get('email') || '').trim();
    const empresa = String(d.get('empresa') || '').trim();
    const sector = d.get('sector') || '';
    let ok = true;
    ['nombre', 'email', 'empresa', 'sector', 'privacidad'].forEach((c) => err(c, ''));
    if (nombre.length < 2) { err('nombre', 'Escribe tu nombre y apellidos.'); ok = false; }
    if (!EMAIL_RE.test(email)) { err('email', 'Revisa el email.'); ok = false; }
    if (empresa.length < 2) { err('empresa', 'Escribe el nombre de tu empresa.'); ok = false; }
    if (!sector) { err('sector', 'Elige tu sector.'); ok = false; }
    if (!d.get('privacidad')) { err('privacidad', 'Necesitamos que aceptes la política de privacidad.'); ok = false; }
    if (!ok) return;
    if (String(d.get('web') || '')) return;

    const boton = lead.querySelector('button[type="submit"]');
    const etiqueta = boton.querySelector('.adv-contact-submit__label');
    const feedback = lead.querySelector('[data-feedback]');
    boton.disabled = true; etiqueta.textContent = 'Enviando…'; feedback.textContent = '';

    const n = L.separarNombre(nombre);
    const res = ultimo || { total: '', porBloque: [], franja: { tag: '' } };
    const payload = L.construir({
      formulario: 'Autodiagnóstico de operaciones',
      origen: 'autodiagnostico-operaciones',
      interes: 'consultoria',
      nombre: n.nombre, apellidos: n.apellidos, email, empresa,
      mensaje: `Autodiagnóstico de operaciones: ${res.total}/30 (${res.franja.tag}). ` +
        BLOQUES.map((b, i) => `${b} ${res.porBloque[i] ?? '-'}/6`).join(' · ') +
        `. Sector: ${sector}. Coste calculado de una tarea: ${recalcular()} € al año.`,
      extra: {
        sector_empresa: sector,
        autodiagnostico_puntuacion: res.total,
        autodiagnostico_franja: res.franja.tag,
        etiquetas: 'autodiagnostico,autodiagnostico-web',
      },
    });

    try {
      await L.enviar(payload);
      if (window.advTrack) window.advTrack('generate_lead', { formulario: 'autodiagnostico_operaciones', interes: 'consultoria', origen: 'web' });
      const okBox = document.createElement('div');
      okBox.className = 'adv-curso-ok';
      okBox.setAttribute('role', 'status');
      okBox.innerHTML = '<h3>Enviado</h3><p></p><a class="btn-glass" target="_blank" rel="noopener">Descargar el autodiagnóstico en PDF</a>';
      okBox.querySelector('p').textContent = `Te escribiremos a ${email} con tu resultado. Mientras, aquí tienes la versión en PDF para hacerlo con tu equipo.`;
      okBox.querySelector('a').href = PDF;
      lead.replaceWith(okBox);
    } catch (e2) {
      boton.disabled = false; etiqueta.textContent = 'Enviarme el resultado';
      feedback.textContent = 'No hemos podido enviarlo. Inténtalo de nuevo en unos minutos o escríbenos a contacto@advantys.ai.';
    }
  });
})();
