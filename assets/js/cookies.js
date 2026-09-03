/* ===========================================================
   BANNER DE COOKIES — Advantys AI
   Se muestra solo si no hay decisión previa. Depende de
   window.advConsent (assets/js/analytics.js).
   =========================================================== */
(function () {
  function construir() {
    if (document.getElementById('adv-cookies')) return;

    var wrap = document.createElement('div');
    wrap.id = 'adv-cookies';
    wrap.className = 'adv-cookies';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Preferencias de cookies');
    wrap.innerHTML =
      '<div class="adv-cookies__texto">' +
        '<p class="adv-cookies__titulo">Usamos cookies</p>' +
        '<p class="adv-cookies__cuerpo">Las técnicas son necesarias para que el sitio funcione. ' +
        'Las analíticas nos ayudan a entender cómo se usa la web y solo se activan si las aceptas. ' +
        'Más detalle en la <a href="/politica-cookies">Política de Cookies</a>.</p>' +
      '</div>' +
      '<div class="adv-cookies__acciones">' +
        '<button type="button" class="adv-cookies__btn adv-cookies__btn--fantasma" data-adv-cookies="rechazar">Solo necesarias</button>' +
        '<button type="button" class="adv-cookies__btn adv-cookies__btn--principal" data-adv-cookies="aceptar">Aceptar</button>' +
      '</div>';

    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('adv-cookies--visible'); });

    wrap.addEventListener('click', function (e) {
      var accion = e.target.getAttribute('data-adv-cookies');
      if (!accion) return;
      if (accion === 'aceptar') window.advConsent.aceptar();
      else window.advConsent.rechazar();
      cerrar();
    });
  }

  function cerrar() {
    var el = document.getElementById('adv-cookies');
    if (!el) return;
    el.classList.remove('adv-cookies--visible');
    setTimeout(function () { el.remove(); }, 300);
  }

  function iniciar() {
    if (!window.advConsent) return;
    if (window.advConsent.estado() === null) construir();
  }

  // Permite reabrir el banner desde el pie o la Política de Cookies
  window.advAbrirPreferenciasCookies = function () {
    window.advConsent.revocar();
    cerrar();
    setTimeout(construir, 320);
  };

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-adv-preferencias-cookies]') : null;
    if (!t) return;
    e.preventDefault();
    window.advAbrirPreferenciasCookies();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
