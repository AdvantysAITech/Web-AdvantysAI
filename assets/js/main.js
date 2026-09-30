/* =========================================
   ADVANTYS AI — Interacciones globales
   1. Píldora de navegación que sigue al puntero
   2. Estado de cabecera al desplazarse (sin listener de scroll)
   3. Desplegable accesible por teclado y táctil
   4. Menú móvil (aria, Escape, bloqueo de scroll)
   5. Entradas al hacer scroll con IntersectionObserver
   ========================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---------- 1. Píldora de navegación ---------- */
  function initNavPill() {
    var nav = document.querySelector('.adv-links-island');
    var pill = document.getElementById('nav-glasser');
    var links = document.querySelectorAll('.adv-link-island:not(.adv-link-island--disabled)');
    if (!nav || !pill || !links.length) return;

    var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    var active = null;

    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\.html$/, '').replace(/\/$/, '');
      var slug = href.split('/').pop();
      if (slug && path.split('/').pop() === slug) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        active = link;
      }
    });

    function moveTo(el, instant) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      var c = nav.getBoundingClientRect();
      pill.classList.toggle('no-anim', !!instant);
      pill.style.setProperty('--pill-x', (r.left - c.left) + 'px');
      pill.style.width = r.width + 'px';
      pill.classList.add('is-visible');
    }

    var hasShown = false;
    links.forEach(function (link) {
      link.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        moveTo(link, !hasShown);
        hasShown = true;
      });
    });

    nav.addEventListener('pointerleave', function () {
      hasShown = false;
      pill.classList.remove('is-visible');
    });
  }

  /* ---------- 2. Estado de cabecera ---------- */
  function initHeaderState() {
    var header = document.querySelector('.adv-header-island');
    if (!header || !('IntersectionObserver' in window)) return;
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:48px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- 3. Desplegable ---------- */
  function initDropdown() {
    document.querySelectorAll('.adv-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.adv-link-island');
      var menu = dd.querySelector('.adv-dropdown-content');
      if (!trigger || !menu) return;
      if (!menu.id) menu.id = 'adv-dropdown-' + Math.random().toString(36).slice(2, 8);
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', menu.id);

      function set(open) {
        dd.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      dd.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') set(true); });
      dd.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') set(false); });
      dd.addEventListener('focusin', function () { set(true); });
      dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) set(false); });
      dd.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { set(false); trigger.focus(); }
      });
    });
  }

  /* ---------- 4. Menú móvil ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var close = document.getElementById('mobile-menu-close');
    if (!toggle || !menu) return;

    toggle.setAttribute('aria-controls', 'mobile-menu');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');

    function set(open) {
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open && close) close.focus({ preventScroll: true });
      if (!open) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', function () { set(!menu.classList.contains('is-open')); });
    if (close) close.addEventListener('click', function () { set(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) set(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches && menu.classList.contains('is-open')) set(false);
    });
  }

  /* ---------- 5. Entradas al hacer scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || reduceMotion.matches || !('IntersectionObserver' in window)) return;

    // Índice de escalonado dentro de cada grupo
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      group.querySelectorAll('[data-reveal]').forEach(function (el, i) {
        el.style.setProperty('--reveal-i', i);
      });
    });

    // Medir antes de ocultar nada: lo que ya está en pantalla nunca parpadea
    var vh = window.innerHeight;
    var inView = [];
    items.forEach(function (el) { inView.push(el.getBoundingClientRect().top < vh * 0.9); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });

    items.forEach(function (el, i) {
      if (inView[i]) el.classList.add('is-revealed');
      else io.observe(el);
    });
    root.classList.add('adv-js');
  }

  ready(function () {
    initNavPill();
    initHeaderState();
    initDropdown();
    initMobileMenu();
    initReveal();
  });
})();
