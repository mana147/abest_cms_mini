document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  }

  // Transparent header → solid background after scrolling past the top
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const updateHeaderOnScroll = () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 60);
    };
    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  }

  // Featured courses carousel controls
  const coursesTrack = document.querySelector('[data-courses-track]');
  if (coursesTrack) {
    document.querySelectorAll('[data-course-scroll]').forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.getAttribute('data-course-scroll') === 'prev' ? -1 : 1;
        const firstCard = coursesTrack.querySelector('.snap-card');
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : coursesTrack.clientWidth;
        const maxScroll = coursesTrack.scrollWidth - coursesTrack.clientWidth;
        const nextPosition = Math.max(0, Math.min(coursesTrack.scrollLeft + direction * (cardWidth + 24), maxScroll));
        coursesTrack.style.scrollSnapType = 'none';
        coursesTrack.scrollTo({ left: nextPosition, behavior: 'auto' });
        requestAnimationFrame(() => {
          coursesTrack.style.scrollSnapType = '';
        });
      });
    });
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
