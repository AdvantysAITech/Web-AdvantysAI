/* =========================================
   FORMULARIO DE INSCRIPCIÓN AL CURSO GRATIS DE IA
   Envía a /api/inscripcion-curso, que lo reenvía al Sistema Advantys
   con la etiqueta de alumno del curso y procedencia web.
   ========================================= */
(function () {
  const form = document.getElementById('adv-curso-form');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const feedback = form.querySelector('[data-feedback]');
  const boton = form.querySelector('button[type="submit"]');
  const etiqueta = boton.querySelector('.adv-contact-submit__label');

  const error = (campo, texto) => {
    const el = form.querySelector(`[data-error-for="${campo}"]`);
    if (el) el.textContent = texto || '';
    const input = form.elements[campo];
    if (input && input.classList) input.classList.toggle('adv-form__input--error', !!texto);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const datos = {
      nombre: String(d.get('nombre') || '').trim(),
      email: String(d.get('email') || '').trim(),
      empresa: String(d.get('empresa') || '').trim(),
      perfil: d.get('perfil') || '',
      sector: d.get('sector') || '',
      idioma_curso: d.get('idioma_curso') || 'es',
      acepta_privacidad: d.get('acepta_privacidad') === 'on',
      acepta_novedades: d.get('acepta_novedades') === 'on',
      web: String(d.get('web') || '')
    };

    let valido = true;
    ['nombre', 'email', 'perfil', 'sector', 'acepta_privacidad'].forEach((c) => error(c, ''));
    if (!datos.nombre) { error('nombre', 'Escribe tu nombre y apellidos.'); valido = false; }
    if (!EMAIL_RE.test(datos.email)) { error('email', 'Revisa el email: así no podemos enviarte el acceso.'); valido = false; }
    if (!datos.perfil) { error('perfil', 'Elige tu perfil.'); valido = false; }
    if (!datos.sector) { error('sector', 'Elige tu sector.'); valido = false; }
    if (!datos.acepta_privacidad) { error('acepta_privacidad', 'Necesitamos que aceptes la política de privacidad.'); valido = false; }
    if (!valido) return;

    boton.disabled = true;
    etiqueta.textContent = 'Enviando…';
    feedback.textContent = '';

    try {
      const r = await fetch('/api/inscripcion-curso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      if (window.gtag) window.gtag('event', 'inscripcion_curso', { origen: 'web' });
      const ok = document.createElement('div');
      ok.className = 'adv-curso-ok';
      ok.setAttribute('role', 'status');
      ok.innerHTML = '<h3>Inscripción completada</h3><p></p>';
      ok.querySelector('p').textContent =
        `Te enviaremos el acceso a ${datos.email} para que crees tu contraseña y entres al curso. Si no lo ves, revisa la carpeta de spam.`;
      form.replaceWith(ok);
    } catch (err) {
      boton.disabled = false;
      etiqueta.textContent = 'Inscríbete gratis';
      feedback.textContent = 'No hemos podido enviar la inscripción. Inténtalo de nuevo en unos minutos o escríbenos a contacto@advantys.ai.';
    }
  });
})();
