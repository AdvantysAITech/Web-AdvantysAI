/* =========================================
   VÍDEO DE CADA SOLUCIÓN
   <section data-adv-video="ID_DE_YOUTUBE">: muestra la portada y solo
   carga el reproductor al pulsar (la página no pesa más por el vídeo).
   Si el atributo está vacío, la sección no se muestra.
   ========================================= */
(function () {
  document.querySelectorAll('[data-adv-video]').forEach(function (sec) {
    var id = (sec.getAttribute('data-adv-video') || '').trim();
    if (!id) { sec.remove(); return; }
    sec.hidden = false;
    var btn = sec.querySelector('.adv-video__play');
    var frame = sec.querySelector('.adv-video__frame');
    var cta = sec.getAttribute('data-adv-video-cta');
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&cc_load_policy=1&hl=es&cc_lang_pref=es';
      f.title = btn.getAttribute('aria-label') || 'Vídeo';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(f);
      if (window.advTrack) window.advTrack('video_play', { video: id, pagina: location.pathname });
    });
    if (cta) {
      var thumb = frame.querySelector('img');
      if (thumb && !thumb.getAttribute('src')) thumb.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg';
    }
  });
})();
