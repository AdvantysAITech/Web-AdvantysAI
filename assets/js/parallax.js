/* =========================================
   PARALLAX DE LOS FONDOS DE HERO
   Mueve cada capa con [data-adv-parallax="factor"] a distinta velocidad
   al hacer scroll y, en ordenador, siguiendo el ratón.
   Sin dependencias. Se desactiva con «reducir movimiento».
   ========================================= */
(function () {
  const capas = Array.from(document.querySelectorAll('[data-adv-parallax]'));
  if (!capas.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.adv-herobg svg').forEach((svg) => {
      if (svg.pauseAnimations) svg.pauseAnimations();
    });
    return;
  }

  const conRaton = window.matchMedia('(pointer: fine)').matches;
  const hero = capas[0].closest('section');
  let mx = 0, my = 0, pendiente = false;

  function pintar() {
    pendiente = false;
    const y = window.scrollY;
    if (hero && y > hero.offsetHeight * 1.2) return;
    capas.forEach((capa) => {
      const f = parseFloat(capa.dataset.advParallax) || 0;
      capa.style.transform = `translate3d(${(mx * f * 70).toFixed(1)}px, ${(y * f + my * f * 24).toFixed(1)}px, 0)`;
    });
  }
  function pedir() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
  }

  window.addEventListener('scroll', pedir, { passive: true });
  if (conRaton) {
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      pedir();
    }, { passive: true });
  }
  pintar();
})();
