document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector('.adv-links-island');
  const glassPill = document.getElementById('nav-glasser');
  const links = document.querySelectorAll('.adv-link-island');

  if (!navContainer || !glassPill || links.length === 0) return;

  const currentPath = window.location.pathname;
  let activeLink = null;

  // 1. Detección Inteligente de página activa
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentPath.includes(href.split('/').pop()) && href.split('/').pop() !== '') {
      link.classList.add('active');
      activeLink = link;
    }
  });

  // 2. Calcula la posición matemáticamente dentro de la isla
  function updatePillPosition(targetElement) {
    if (!targetElement) return;
    
    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = navContainer.getBoundingClientRect();
    
    const leftPos = targetRect.left - containerRect.left;
    
    glassPill.style.width = `${targetRect.width}px`;
    glassPill.style.height = `${targetRect.height}px`; 
    glassPill.style.left = `${leftPos}px`;
    glassPill.classList.add('is-visible');
  }

  // 3. Inicialización retardada para precisión de renderizado
  if (activeLink) {
    setTimeout(() => updatePillPosition(activeLink), 100);
  }

  // 4. Tracker del ratón
  links.forEach(link => {
    link.addEventListener('mouseenter', () => updatePillPosition(link));
  });

  // 5. Retorno al estado activo
  navContainer.addEventListener('mouseleave', () => {
    if (activeLink) {
      updatePillPosition(activeLink);
    } else {
      glassPill.classList.remove('is-visible');
    }
  });
  
  // 6. Recalcular al redimensionar la pantalla
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && activeLink) {
      updatePillPosition(activeLink);
    }
  });
});

// 7. Menú móvil
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');

  if (!mobileToggle || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Cerrar con el botón X del panel
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  // Cerrar al pulsar un enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});