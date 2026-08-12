/* ===========================================================
   AUTODIAGNÓSTICO ISO/IEC 42001 — Advantys AI
   Toda la configuración editable está en el bloque CONFIG.
   =========================================================== */
(() => {
  // ===========================================================
  // CONFIG — edita solo esto
  // ===========================================================
    const CONFIG = {
        empresa: 'Advantys AI',
        emailContacto: 'info@advantys.ai',
        webhookURL: '',            // ← pon aquí la URL del webhook de n8n
        envioAutomatico: true,
        origen: 'autodiagnostico-iso-42001',
    };

  const WEBHOOK = CONFIG.webhookURL || window.ADV_WEBHOOK_URL || '';

  // ===========================================================
  // ÁREAS DE LA NORMA
  // ===========================================================
  const AREAS = [
    { id: 'contexto',  nombre: 'Contexto y alcance' },
    { id: 'liderazgo', nombre: 'Liderazgo y política de IA' },
    { id: 'riesgos',   nombre: 'Riesgos e impacto de la IA' },
    { id: 'soporte',   nombre: 'Personas y documentación' },
    { id: 'operacion', nombre: 'Operación y proveedores' },
    { id: 'mejora',    nombre: 'Seguimiento y mejora' },
  ];

  const PREGUNTAS = [
    { a: 'contexto',  t: '¿Tenéis un inventario claro de los sistemas de IA que usa o desarrolla la empresa?' },
    { a: 'contexto',  t: '¿Habéis identificado a quién afecta vuestra IA (clientes, empleados, reguladores) y qué esperan de vosotros?' },
    { a: 'contexto',  t: '¿Está definido qué partes de la empresa y qué sistemas de IA entrarían en un sistema de gestión de IA?' },
    { a: 'liderazgo', t: '¿Existe una política de uso responsable de la IA aprobada por la dirección?' },
    { a: 'liderazgo', t: '¿Hay una persona o equipo con responsabilidad asignada sobre la gobernanza de la IA?' },
    { a: 'riesgos',   t: '¿Evaluáis los riesgos de vuestros sistemas de IA (sesgo, errores, seguridad, privacidad)?' },
    { a: 'riesgos',   t: '¿Analizáis el impacto que vuestra IA puede tener sobre las personas antes de ponerla en marcha?' },
    { a: 'riesgos',   t: '¿Tenéis objetivos concretos y medibles sobre el uso responsable de la IA?' },
    { a: 'soporte',   t: '¿El personal que trabaja con IA ha recibido formación sobre su uso responsable?' },
    { a: 'soporte',   t: '¿Los procesos relacionados con la IA están documentados y actualizados?' },
    { a: 'operacion', t: '¿Controláis el ciclo de vida completo de vuestros sistemas de IA (diseño, pruebas, despliegue, retirada)?' },
    { a: 'operacion', t: '¿Evaluáis y supervisáis a los proveedores que os desarrollan o suministran soluciones de IA?' },
    { a: 'operacion', t: '¿Informáis a los usuarios cuando interactúan con un sistema de IA o reciben decisiones generadas por IA?' },
    { a: 'mejora',    t: '¿Revisáis periódicamente (auditoría interna o similar) cómo se está usando la IA en la empresa?' },
    { a: 'mejora',    t: '¿Existe un proceso para registrar y corregir incidentes o fallos de los sistemas de IA?' },
  ];

  const OPCIONES = [
    { p: 0, t: 'No, o no lo sabemos' },
    { p: 1, t: 'Está en marcha, pero sin formalizar' },
    { p: 2, t: 'Sí, aunque no está del todo documentado' },
    { p: 3, t: 'Sí, implantado y documentado' },
  ];

  const BANDAS = [
    {
      min: 0, cls: 0, label: 'Nivel inicial',
      desc: 'La gobernanza de IA es aún incipiente. La buena noticia: partís de cero con el camino claro, y es el mejor momento para construir el sistema bien desde el principio.',
    },
    {
      min: 35, cls: 1, label: 'En desarrollo',
      desc: 'Hay prácticas en marcha, pero sin la estructura y la evidencia documental que exigiría una auditoría de certificación. Con un plan dirigido, la certificación es alcanzable en 6–9 meses.',
    },
    {
      min: 60, cls: 2, label: 'Nivel avanzado',
      desc: 'Tenéis una base sólida. Falta cerrar huecos concretos y formalizar evidencias para superar una auditoría de tercera parte. Estáis más cerca de lo que pensáis.',
    },
    {
      min: 85, cls: 3, label: 'Preparados para certificación',
      desc: 'Vuestro nivel de madurez es alto. El siguiente paso natural es una auditoría interna independiente y la solicitud de certificación.',
    },
  ];

  const RECS = {
    contexto:  { t: 'Inventario y alcance', d: 'Elabora un inventario de sistemas de IA y define qué partes de la empresa cubriría el sistema de gestión. Sin alcance claro, nada de lo demás se puede construir.' },
    liderazgo: { t: 'Política y responsables', d: 'Aprueba una política de IA respaldada por la dirección y asigna formalmente responsabilidades. Es lo primero que revisa cualquier auditor.' },
    riesgos:   { t: 'Riesgos e impacto', d: 'Implanta una evaluación sistemática de riesgos e impacto de cada sistema de IA. Es el corazón de la ISO 42001 y del AI Act.' },
    soporte:   { t: 'Formación y documentación', d: 'Forma al personal en uso responsable de IA y documenta los procesos clave. La evidencia documental es lo que convierte buenas prácticas en conformidad auditable.' },
    operacion: { t: 'Ciclo de vida y proveedores', d: 'Establece controles sobre el ciclo de vida de tus sistemas de IA y sobre los proveedores que los desarrollan. Lo que hace un tercero también es responsabilidad tuya ante la norma.' },
    mejora:    { t: 'Seguimiento y mejora', d: 'Pon en marcha revisiones periódicas, gestión de incidentes de IA y auditoría interna. Un sistema sin seguimiento se degrada y no supera la certificación.' },
  };

  // ===========================================================
  // ESTADO
  // ===========================================================
  let idx = 0;
  const respuestas = new Array(PREGUNTAS.length).fill(null);
  const datos = {};
  let resultado = null;

  const $ = (id) => document.getElementById(id);

  const el = {
    screens: document.querySelectorAll('.adv-auto__screen'),
    // datos
    nombre: $('auto-nombre'),
    empresa: $('auto-empresa'),
    email: $('auto-email'),
    tel: $('auto-tel'),
    rol: $('auto-rol'),
    error: $('auto-error'),
    // quiz
    pbar: $('auto-pbar'),
    qcount: $('auto-qcount'),
    qarea: $('auto-qarea'),
    qtext: $('auto-qtext'),
    qopts: $('auto-qopts'),
    qback: $('auto-qback'),
    // resultado
    rtitle: $('auto-rtitle'),
    rscore: $('auto-rscore'),
    rband: $('auto-rband'),
    rdesc: $('auto-rdesc'),
    rareas: $('auto-rareas'),
    rrecs: $('auto-rrecs'),
    ctaTitle: $('auto-cta-title'),
    feedback: $('auto-feedback'),
  };

  if (!el.qopts) return; // no estamos en la página del autodiagnóstico

  // ===========================================================
  // NAVEGACIÓN ENTRE PANTALLAS
  // ===========================================================
  function go(id) {
    el.screens.forEach((s) => { s.hidden = true; });
    const target = $(id);
    if (target) target.hidden = false;
    const shell = document.querySelector('.adv-auto__shell');
    if (shell) window.scrollTo({ top: shell.offsetTop - 120, behavior: 'smooth' });
  }

  // ===========================================================
  // PASO 1 — DATOS
  // ===========================================================
  function validarDatos() {
    datos.nombre  = el.nombre.value.trim();
    datos.empresa = el.empresa.value.trim();
    datos.email   = el.email.value.trim();
    datos.telefono = el.tel.value.trim();
    datos.rol     = el.rol.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email);
    if (!datos.nombre || !datos.empresa || !emailOk || !datos.rol) {
      el.error.classList.add('is-visible');
      return;
    }
    el.error.classList.remove('is-visible');
    idx = 0;
    renderQ();
    go('auto-s-quiz');
  }

  // ===========================================================
  // PASO 2 — CUESTIONARIO
  // ===========================================================
  function renderQ() {
    const q = PREGUNTAS[idx];
    const area = AREAS.find((a) => a.id === q.a);

    el.qarea.textContent = area.nombre;
    el.qtext.textContent = q.t;
    el.qcount.textContent = `Pregunta ${idx + 1} de ${PREGUNTAS.length}`;
    el.pbar.style.width = `${(idx / PREGUNTAS.length) * 100}%`;
    el.qback.style.visibility = idx === 0 ? 'hidden' : 'visible';

    el.qopts.innerHTML = '';
    OPCIONES.forEach((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'adv-auto__option' + (respuestas[idx] === o.p ? ' is-selected' : '');
      b.innerHTML = `<span class="adv-auto__dot adv-auto__dot--${o.p}"></span><span>${o.t}</span>`;
      b.addEventListener('click', () => { respuestas[idx] = o.p; nextQ(); });
      el.qopts.appendChild(b);
    });
  }

  function nextQ() {
    if (idx < PREGUNTAS.length - 1) { idx++; renderQ(); }
    else { calcular(); }
  }

  function prevQ() { if (idx > 0) { idx--; renderQ(); } }

  // ===========================================================
  // RESULTADO
  // ===========================================================
  function calcular() {
    const porArea = {};
    AREAS.forEach((a) => { porArea[a.id] = { pts: 0, max: 0 }; });
    PREGUNTAS.forEach((q, i) => {
      porArea[q.a].pts += respuestas[i] === null ? 0 : respuestas[i];
      porArea[q.a].max += 3;
    });

    const total = Object.values(porArea).reduce((s, a) => s + a.pts, 0);
    const max   = Object.values(porArea).reduce((s, a) => s + a.max, 0);
    const pct   = Math.round((total / max) * 100);
    const banda = [...BANDAS].reverse().find((b) => pct >= b.min);

    resultado = { pct, banda: banda.label, porArea };

    el.rtitle.textContent = `${datos.empresa}: resultado de tu diagnóstico`;
    el.rscore.textContent = pct;
    el.rband.textContent = banda.label;
    el.rband.className = `adv-auto__band adv-auto__band--${banda.cls}`;
    el.rdesc.textContent = banda.desc;

    const ordenadas = AREAS.map((a) => {
      const d = porArea[a.id];
      return Object.assign({}, a, { pct: Math.round((d.pts / d.max) * 100) });
    });

    el.rareas.innerHTML = '';
    ordenadas.forEach((a) => {
      const fill = a.pct < 35
        ? 'rgba(255, 57, 53, 0.6)'
        : a.pct < 60
          ? 'rgba(228, 145, 102, 0.8)'
          : 'linear-gradient(to right, var(--color-red), var(--color-coral), var(--color-orange))';
      el.rareas.insertAdjacentHTML('beforeend', `
        <div class="adv-auto__row">
          <div class="adv-auto__row-top">
            <span class="adv-auto__row-name">${a.nombre}</span>
            <span class="adv-auto__row-pct">${a.pct}%</span>
          </div>
          <div class="adv-auto__bar"><div data-w="${a.pct}" style="background:${fill}"></div></div>
        </div>`);
    });

    const peores = [...ordenadas].sort((x, y) => x.pct - y.pct).slice(0, 3);
    el.rrecs.innerHTML = '';
    peores.forEach((a, i) => {
      const r = RECS[a.id];
      el.rrecs.insertAdjacentHTML('beforeend',
        `<div class="adv-auto__rec"><strong>${i + 1}. ${r.t}</strong>${r.d}</div>`);
    });

    el.ctaTitle.textContent = `¿Quieres la hoja de ruta completa con ${CONFIG.empresa}?`;

    go('auto-s-result');

    // Animación de las barras una vez visibles
    requestAnimationFrame(() => {
      el.rareas.querySelectorAll('[data-w]').forEach((bar) => {
        bar.style.width = bar.getAttribute('data-w') + '%';
      });
    });

    if (CONFIG.envioAutomatico) enviarWebhook(false);
  }

  // ===========================================================
  // ENVÍO DEL LEAD
  // ===========================================================
  function payload(solicitaInforme) {
    return {
      origen: CONFIG.origen,
      fecha: new Date().toISOString(),
      linea_negocio: 'Auditoria ISO 42001',
      solicita_informe: !!solicitaInforme,
      nombre: datos.nombre,
      empresa: datos.empresa,
      email: datos.email,
      telefono: datos.telefono || '',
      relacion_ia: datos.rol,
      puntuacion: resultado ? resultado.pct : null,
      nivel: resultado ? resultado.banda : null,
      areas: resultado ? Object.fromEntries(AREAS.map((a) => {
        const d = resultado.porArea[a.id];
        return [a.nombre, Math.round((d.pts / d.max) * 100)];
      })) : {},
      respuestas: PREGUNTAS.map((q, i) => ({ area: q.a, pregunta: q.t, valor: respuestas[i] })),
    };
  }

  async function enviarWebhook(solicitaInforme) {
    if (!WEBHOOK) return false;
    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload(solicitaInforme)),
      });
      return true;
    } catch (e) {
      return false; // silencioso: no bloquea la experiencia del usuario
    }
  }

  async function solicitarInforme() {
    const p = payload(true);
    const enviado = await enviarWebhook(true);

    if (enviado) {
      el.feedback.textContent = 'Solicitud enviada. Un consultor revisará tus respuestas y te escribirá en menos de 24 h.';
      return;
    }

    // Fallback: abrir el gestor de correo con el resumen
    const cuerpo =
`Solicitud de diagnóstico completo ISO/IEC 42001

Nombre: ${p.nombre}
Empresa: ${p.empresa}
Email: ${p.email}
Teléfono: ${p.telefono || '-'}
Relación con la IA: ${p.relacion_ia}

Puntuación: ${p.puntuacion}/100 (${p.nivel})
${Object.entries(p.areas).map(([k, v]) => `· ${k}: ${v}%`).join('\n')}`;

    window.location.href =
      `mailto:${CONFIG.emailContacto}?subject=${encodeURIComponent('Diagnóstico ISO 42001 — ' + p.empresa)}&body=${encodeURIComponent(cuerpo)}`;
    el.feedback.textContent =
      'Se ha abierto tu gestor de correo con el resumen. Si no se abre, escríbenos a ' + CONFIG.emailContacto + '.';
  }

  // ===========================================================
  // LISTENERS
  // ===========================================================
  document.querySelectorAll('[data-auto-go]').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.getAttribute('data-auto-go')));
  });

  const btnValidar = $('auto-btn-continuar');
  if (btnValidar) btnValidar.addEventListener('click', validarDatos);

  if (el.qback) el.qback.addEventListener('click', prevQ);

  const btnCta = $('auto-btn-cta');
  if (btnCta) btnCta.addEventListener('click', solicitarInforme);
})();