document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.adv-disclosure-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.hidden = true;
      } else {
        panel.hidden = false;
      }
    });
  });
});
