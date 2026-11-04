/* =========================================
   VÍDEO DE CADA SOLUCIÓN
   <section data-adv-video="ID_DE_YOUTUBE">: muestra la portada y solo
   carga el reproductor al pulsar (la página no pesa más por el vídeo).
   <section data-adv-video-src="/assets/videos/x.mp4" data-adv-video-poster="/assets/videos/x.jpg">:
   igual, pero con el vídeo alojado en la propia web (versiones en catalán e inglés).
   Si no hay ni ID ni archivo, la sección no se muestra.
   ========================================= */
(function () {
  document.querySelectorAll('[data-adv-video]').forEach(function (sec) {
    var id = (sec.getAttribute('data-adv-video') || '').trim();
    var src = (sec.getAttribute('data-adv-video-src') || '').trim();
    var poster = (sec.getAttribute('data-adv-video-poster') || '').trim();
    if (!id && !src) { sec.remove(); return; }
    sec.hidden = false;
    var btn = sec.querySelector('.adv-video__play');
    var frame = sec.querySelector('.adv-video__frame');
    var cta = sec.getAttribute('data-adv-video-cta');
    btn.addEventListener('click', function () {
      if (src) {
        var v = document.createElement('video');
        v.src = src;
        if (poster) v.poster = poster;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        v.preload = 'auto';
        v.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Vídeo');
        frame.innerHTML = '';
        frame.appendChild(v);
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
        if (window.advTrack) window.advTrack('video_play', { video: src, pagina: location.pathname });
        return;
      }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&hl=es';
      f.title = btn.getAttribute('aria-label') || 'Vídeo';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(f);
      if (window.advTrack) window.advTrack('video_play', { video: id, pagina: location.pathname });
    });
    if (cta) {
      var thumb = frame.querySelector('img');
      if (thumb && !thumb.getAttribute('src')) thumb.src = poster || ('https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg');
    }
  });
})();
