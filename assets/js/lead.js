// ===========================================================
// LEAD — Contrato único web → GHL (webhook entrante)
//
// Todos los formularios de la web (solicitud, CTA de spin-off,
// autodiagnóstico ISO 42001 y partners) construyen su envío con
// window.advLead.construir(), de modo que el webhook de GHL recibe
// SIEMPRE las mismas claves y con los valores EXACTOS de las opciones
// de los campos de GHL (mayúsculas y tildes incluidas). GHL descarta
// en silencio cualquier valor que no coincida con una opción.
//
// Si cambian las opciones en GHL, este archivo es el único sitio a tocar.
// Debe cargarse DESPUÉS de config.js y ANTES del script del formulario.
// ===========================================================
(() => {
  // --- Opciones exactas de GHL ---------------------------------------------
  const LINEA = {
    consultoria: 'Consultoría Tecnológica',
    jv: 'Joint Venture Builder',
    iso: 'Implantación ISO 42001',
  };

  const SERVICIO = {
    sistema: 'Consultoría Sistema Advantys',
    adhoc: 'Consultoría IA AdHoc',
    iso: 'Consultoría ISO 42001',
  };

  const ROL = {
    cliente: 'Cliente final',
    inversor: 'Inversor',
  };

  // Opción del campo «Spin-off» de GHL (clave interna → etiqueta GHL)
  const SPINOFF_GHL = {
    educacion: 'Educación',
    hospitality: 'Hospitality',
    residencia: 'Residencia',
    agro: 'Agro',
  };

  // Nombre comercial que se muestra en la web
  const SPINOFF_NOMBRE = {
    educacion: 'Advantys AI Educación',
    hospitality: 'Advantys AI Hospitality',
    residencia: 'Advantys AI Residencia Fiscal',
    agro: 'Advantys AI Trazabilidad Agroalimentaria',
  };

  // Acepta la clave interna, la etiqueta GHL o valores antiguos de enlaces
  // ya publicados (?spinoff=Agro, ?spinoff=Educación...).
  function claveSpinoff(valor) {
    if (!valor) return '';
    const v = String(valor).trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    return SPINOFF_GHL[v] ? v : '';
  }

  // --- Intereses (misma lógica que el árbol T1 de la App Comercial) --------
  // Cada interés decide línea, servicio, ruta, rol y si se abre oportunidad.
  const INTERESES = {
    sistema: {
      texto: 'Automatizar marketing, ventas, posventa o gestión',
      linea: LINEA.consultoria, servicio: SERVICIO.sistema, ruta: 'RUTA_1',
      oportunidad: true,
    },
    consultoria: {
      texto: 'Jornada de consultoría estratégica',
      linea: LINEA.consultoria, servicio: SERVICIO.sistema, ruta: 'RUTA_1',
      oportunidad: true,
    },
    proyecto_ia: {
      texto: 'Un proyecto de IA a medida para un proceso concreto',
      linea: LINEA.consultoria, servicio: SERVICIO.adhoc, ruta: 'RUTA_2',
      oportunidad: true,
    },
    solucion_sectorial: {
      texto: 'Implantar una de nuestras soluciones sectoriales',
      linea: LINEA.jv, rol: ROL.cliente, ruta: 'RUTA_6',
      requiereSpinoff: true, oportunidad: true,
    },
    invertir: {
      texto: 'Invertir en una spin-off de Advantys',
      linea: LINEA.jv, rol: ROL.inversor, ruta: 'RUTA_7',
      requiereSpinoff: true, oportunidad: true,
    },
    iso42001: {
      texto: 'Implantar la ISO/IEC 42001 en mi empresa',
      linea: LINEA.iso, servicio: SERVICIO.iso, ruta: 'RUTA_5',
      oportunidad: true,
    },
    partners: {
      texto: 'Ser partner o colaborador de Advantys',
      linea: '', oportunidad: false,
    },
    otro: {
      texto: 'Otra consulta',
      linea: '', oportunidad: false,
    },
  };

  const nuevoUuid = () =>
    (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  // Separa "Nombre Apellido Apellido" cuando el formulario solo tiene un campo.
  function separarNombre(completo) {
    const partes = String(completo || '').trim().split(/\s+/);
    return { nombre: partes.shift() || '', apellidos: partes.join(' ') };
  }

  /**
   * Construye el payload común.
   * @param {object} d
   *   interes, spinoff, formulario, origen, uuid,
   *   nombre, apellidos, email, telefono, empresa, ciudad, pais, pais_nombre,
   *   mensaje, extra (objeto con campos propios del formulario)
   */
  function construir(d) {
    const i = INTERESES[d.interes] || INTERESES.otro;
    const spin = i.requiereSpinoff ? claveSpinoff(d.spinoff) : '';

    return Object.assign({
      // Identificación del envío
      uuid: d.uuid || nuevoUuid(),
      fecha: new Date().toISOString(),
      formulario: d.formulario || '',
      origen: d.origen || '',

      // Contacto
      nombre: d.nombre || '',
      apellidos: d.apellidos || '',
      email: d.email || '',
      telefono: d.telefono || '',
      empresa: d.empresa || '',
      ciudad: d.ciudad || '',
      pais: d.pais || '',
      pais_nombre: d.pais_nombre || '',
      idioma_preferido: 'Español',
      fuente_captacion: 'Web',
      fuente: `Web Advantys — ${d.formulario || 'formulario'}${d.origen ? ` (${d.origen})` : ''}`,

      // Clasificación
      interes: d.interes || 'otro',
      interes_texto: i.texto,
      linea_negocio: i.linea,
      servicio: i.servicio || '',
      ruta: i.ruta || '',
      rol_jv: i.rol || '',
      spinoff: spin ? SPINOFF_GHL[spin] : '',
      spinoff_nombre: spin ? SPINOFF_NOMBRE[spin] : '',
      mensaje: d.mensaje || '',

      // Oportunidad
      abrir_oportunidad: i.oportunidad ? 'Sí' : 'No',
      fase_entrada: i.oportunidad ? 'Prospecto Identificado' : '',
      calificacion: 'SIN_CALIFICAR',
    }, d.extra || {});
  }

  async function enviar(payload) {
    const url = window.ADV_WEBHOOK_URL;
    if (!url) throw new Error('Falta ADV_WEBHOOK_URL');
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return true;
  }

  window.advLead = {
    INTERESES, SPINOFF_GHL, SPINOFF_NOMBRE,
    claveSpinoff, separarNombre, nuevoUuid, construir, enviar,
  };
})();
