document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  }

  // Language dropdown toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langToggle.classList.toggle('open');
    });
    document.addEventListener('click', () => langToggle.classList.remove('open'));
  }

  // Auto-hide flash alerts after 4s
  document.querySelectorAll('.flash-container .alert').forEach((alert) => {
    setTimeout(() => {
      alert.classList.remove('show');
      alert.addEventListener('transitionend', () => alert.remove());
    }, 4000);
  });

  // Cookie consent
  const cookieBox = document.getElementById('cookieConsent');
  const cookieAccept = document.getElementById('cookieAccept');
  if (cookieBox && cookieAccept) {
    if (localStorage.getItem('cookieConsent') === 'accepted') {
      cookieBox.classList.add('is-hidden');
    } else {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBox.classList.add('is-hidden');
      });
    }
  }
});
