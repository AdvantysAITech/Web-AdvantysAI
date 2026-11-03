/* =========================================
   AUTODIAGNÓSTICO DE OPERACIONES
   15 frases puntuadas 0/1/2 → puntuación sobre 30, franja y áreas.
   Calculadora «Ponle precio» y envío del resultado como lead.
   ========================================= */
(function () {
  const advT = window.advT || ((x, v) => x);
  const form = document.getElementById('adv-ado-form');
  if (!form) return;

  const BLOQUES_ES = ['Flujo de trabajo', 'Datos y decisiones', 'Personas y dependencias', 'Sistemas', 'Cliente y cobro'];
  const BLOQUES = BLOQUES_ES.map((b) => advT(b));
  const FRANJAS = [
    { max: 8, es: 'Operación sana', tag: advT('Operación sana'), titulo: advT('Tu empresa funciona con orden'),
      texto: advT('Hay pocas señales de pérdida. Lo más rentable ahora es atacar la mejora que más se repite cada día: pequeña, medible y con retorno rápido.') },
    { max: 18, es: 'Pérdidas silenciosas', tag: advT('Pérdidas silenciosas'), titulo: advT('Es el resultado más habitual'),
      texto: advT('Varias fricciones del día a día probablemente te cuestan miles de euros al año sin aparecer en ningún informe. Merece la pena medirlas antes de comprar ninguna herramienta.') },
    { max: 30, es: 'Crecer te está saliendo caro', tag: advT('Crecer te está saliendo caro'), titulo: advT('Tu operación depende demasiado de personas, hojas de cálculo y papel'),
      texto: advT('Cada pedido nuevo añade trabajo manual. Antes de crecer más, conviene ordenar los procesos que más se repiten y decidir qué automatizar primero.') },
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
    count.textContent = advT('{n} de {t} respondidas', { n: hechas, t: preguntas.length });
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
  const fmt = new Intl.NumberFormat(window.advLang === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: 0 });
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
    if (nombre.length < 2) { err('nombre', advT('Escribe tu nombre y apellidos.')); ok = false; }
    if (!EMAIL_RE.test(email)) { err('email', advT('Revisa el email.')); ok = false; }
    if (empresa.length < 2) { err('empresa', advT('Escribe el nombre de tu empresa.')); ok = false; }
    if (!sector) { err('sector', advT('Elige tu sector.')); ok = false; }
    if (!d.get('privacidad')) { err('privacidad', advT('Necesitamos que aceptes la política de privacidad.')); ok = false; }
    if (!ok) return;
    if (String(d.get('web') || '')) return;

    const boton = lead.querySelector('button[type="submit"]');
    const etiqueta = boton.querySelector('.adv-contact-submit__label');
    const feedback = lead.querySelector('[data-feedback]');
    boton.disabled = true; etiqueta.textContent = advT('Enviando…'); feedback.textContent = '';

    const n = L.separarNombre(nombre);
    const res = ultimo || { total: '', porBloque: [], franja: { tag: advT('') } };
    const payload = L.construir({
      formulario: 'Autodiagnóstico de operaciones',
      origen: 'autodiagnostico-operaciones',
      interes: 'consultoria',
      nombre: n.nombre, apellidos: n.apellidos, email, empresa,
      mensaje: `Autodiagnóstico de operaciones: ${res.total}/30 (${res.franja.es || res.franja.tag}). ` +
        BLOQUES_ES.map((b, i) => `${b} ${res.porBloque[i] ?? '-'}/6`).join(' · ') +
        `. Sector: ${sector}. Coste calculado de una tarea: ${recalcular()} € al año.`,
      extra: {
        sector_empresa: sector,
        autodiagnostico_puntuacion: res.total,
        autodiagnostico_franja: res.franja.es || res.franja.tag,
        etiquetas: 'autodiagnostico,autodiagnostico-web',
      },
    });

    try {
      await L.enviar(payload);
      if (window.advTrack) window.advTrack('generate_lead', { formulario: 'autodiagnostico_operaciones', interes: 'consultoria', origen: 'web' });
      const okBox = document.createElement('div');
      okBox.className = 'adv-curso-ok';
      okBox.setAttribute('role', 'status');
      okBox.innerHTML = '<h3></h3><p></p><a class="btn-glass" target="_blank" rel="noopener"></a>';
      okBox.querySelector('h3').textContent = advT('Enviado');
      okBox.querySelector('a').textContent = advT('Descargar el autodiagnóstico en PDF');
      okBox.querySelector('p').textContent = advT('Te escribiremos a {email} con tu resultado. Mientras, aquí tienes la versión en PDF para hacerlo con tu equipo.', { email });
      okBox.querySelector('a').href = PDF;
      lead.replaceWith(okBox);
    } catch (e2) {
      boton.disabled = false; etiqueta.textContent = advT('Enviarme el resultado');
      feedback.textContent = advT('No hemos podido enviarlo. Inténtalo de nuevo en unos minutos o escríbenos a contacto@advantys.ai.');
    }
  });
})();
