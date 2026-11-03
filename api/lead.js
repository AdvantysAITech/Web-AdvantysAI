/*
  Recibe los formularios de la web y los reenvía al Sistema Advantys.
  La dirección de destino vive aquí (o en la variable LEAD_WEBHOOK_URL),
  nunca en el código que se descarga el navegador.
*/
const DESTINO = process.env.LEAD_WEBHOOK_URL ||
  'https://services.leadconnectorhq.com/hooks/tT0GAvtx8iOs64cDrzg2/webhook-trigger/e958aadb-11e2-4144-908c-cd7ac60d2a64';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== 'object' || !body.email) {
    return res.status(400).json({ ok: false, error: 'bad_request' });
  }
  try {
    const r = await fetch(DESTINO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      console.error('El Sistema Advantys respondió', r.status);
      return res.status(502).json({ ok: false, error: 'upstream' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error reenviando el lead', err);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }
};
