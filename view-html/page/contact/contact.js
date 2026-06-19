// Micro-interactions and effects
document.querySelectorAll('.form-control-custom').forEach(el => {
    el.addEventListener('focus', function () {
        const label = this.closest('div')?.querySelector('.form-label-custom');
        if (label) label.classList.add('text-primary');
    });
    el.addEventListener('blur', function () {
        const label = this.closest('div')?.querySelector('.form-label-custom');
        if (label) label.classList.remove('text-primary');
    });
});

// Simple scroll reveal for header
const navbar = document.getElementById('mainNav');
window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-md');
    } else {
        navbar.classList.remove('shadow-md');
    }
});

// Map placeholder click (demo)
document.querySelectorAll('.map-placeholder').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () {
        alert('Mở Google Maps (demo)');
    });
});

// Scroll reveal using IntersectionObserver
document.addEventListener('DOMContentLoaded', function () {
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }
});