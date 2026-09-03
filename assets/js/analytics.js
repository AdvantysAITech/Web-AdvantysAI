/* ===========================================================
   MEDICIÓN — Advantys AI
   GA4 con Consent Mode v2. Por defecto TODO denegado: hasta que
   el usuario acepta en el banner, GA4 no escribe cookies.
   Debe cargarse en el <head>, antes que cookies.js.
   =========================================================== */
(function () {
  var GA_ID = 'G-R7YFSSMVTE';
  var COOKIE = 'cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // --- Estado guardado: 'granted' | 'denied' | null (sin decidir) ---
  function leerConsentimiento() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    if (!m) return null;
    var v = decodeURIComponent(m[1]);
    return (v === 'granted' || v === 'denied') ? v : null;
  }

  function guardarConsentimiento(valor) {
    // 12 meses, coherente con lo declarado en la Política de Cookies
    var exp = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = COOKIE + '=' + valor + '; expires=' + exp +
      '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }

  var previo = leerConsentimiento();

  // --- Consent Mode v2: denegado por defecto ---
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  if (previo === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'denied',          // aún no hay publicidad activa
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
  }

  // gtag.js se carga con una etiqueta <script async> estatica en el <head>
  // de cada pagina, justo despues de este archivo. No se inyecta nada en
  // tiempo de ejecucion.
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  // --- API pública ---
  window.advConsent = {
    estado: function () { return leerConsentimiento(); },
    aceptar: function () {
      guardarConsentimiento('granted');
      gtag('consent', 'update', { analytics_storage: 'granted' });
    },
    rechazar: function () {
      guardarConsentimiento('denied');
      gtag('consent', 'update', { analytics_storage: 'denied' });
    },
    revocar: function () {
      document.cookie = COOKIE + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  };

  // Evento seguro: nunca rompe el formulario si gtag no ha cargado
  window.advTrack = function (evento, parametros) {
    try { gtag('event', evento, parametros || {}); } catch (e) { /* silencioso */ }
  };
})();
