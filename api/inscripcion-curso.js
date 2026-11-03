/*
  Inscripción al curso gratis de IA desde advantys.ai/curso-ia-empresas.

  Reenvía los datos al mismo endpoint que usa la landing del curso
  (ccandorra.advantys.ai/api/inscripcion), que es quien los manda al
  Sistema Advantys y dispara el email de acceso. Así no se duplica la
  URL secreta del webhook ni la lógica de etiquetas.

  - Destino configurable con la variable CURSO_INSCRIPCION_URL.
  - Se envía origen "web": la landing lo convierte en la etiqueta de
    procedencia (origen-web-advantys) cuando lo tenga en su lista.
*/
const DESTINO = process.env.CURSO_INSCRIPCION_URL || 'https://ccandorra.advantys.ai/api/inscripcion';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PERFILES = ['empresario', 'trabajador', 'autonomo'];
const SECTORES = ['comercio', 'hosteleria', 'servicios', 'logistica', 'construccion', 'finanzas', 'otro'];

const limpiar = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 200);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ ok: false, error: 'bad_request' });

  // Campo trampa para bots
  if (limpiar(b.web)) return res.status(200).json({ ok: true });

  const datos = {
    nombre: limpiar(b.nombre, 120),
    email: limpiar(b.email, 160).toLowerCase(),
    empresa: limpiar(b.empresa, 160),
    perfil: limpiar(b.perfil, 20),
    sector: limpiar(b.sector, 20),
    idioma_curso: b.idioma_curso === 'ca' ? 'ca' : 'es',
    acepta_privacidad: b.acepta_privacidad === true,
    acepta_novedades: b.acepta_novedades === true,
    idioma_web: 'es',
    origen: 'web',
    fecha: new Date().toISOString()
  };

  if (!datos.nombre || !EMAIL_RE.test(datos.email) || !PERFILES.includes(datos.perfil) ||
      !SECTORES.includes(datos.sector) || !datos.acepta_privacidad) {
    return res.status(422).json({ ok: false, error: 'invalid' });
  }

  try {
    const r = await fetch(DESTINO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!r.ok) {
      console.error('La inscripción respondió', r.status);
      return res.status(502).json({ ok: false, error: 'upstream' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error reenviando la inscripción', err);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }
};
