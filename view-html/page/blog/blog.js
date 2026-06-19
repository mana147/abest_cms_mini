// Category filter buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.category-btn').forEach(b => {
            b.classList.remove('active');
            b.classList.add('inactive');
        });
        this.classList.remove('inactive');
        this.classList.add('active');
    });
});

// Sticky navbar hide/show
let lastScrollTop = 0;
const navbar = document.getElementById('mainNav');
window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('hidden-nav');
    } else {
        navbar.classList.remove('hidden-nav');
    }
    lastScrollTop = scrollTop;
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
        // Fallback: reveal immediately
        revealEls.forEach(el => el.classList.add('visible'));
    }
});