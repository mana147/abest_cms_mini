// aboutUs.js
// Adds scroll reveal animations for sections, cards and key elements.
(function () {
    function initScrollReveal() {
        const selectors = [
            'section',
            'header',
            'footer',
            '.card-float',
            '.group',
            '.position-relative img',
        ];

        const elements = selectors
            .map(sel => Array.from(document.querySelectorAll(sel)))
            .flat();

        const unique = Array.from(new Set(elements)).filter(el => el instanceof HTMLElement);

        unique.forEach(el => {
            if (!el.classList.contains('no-reveal')) el.classList.add('scroll-reveal');
        });

        if (!('IntersectionObserver' in window)) {
            unique.forEach(el => el.classList.add('reveal-active'));
            return;
        }

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });

        unique.forEach(el => obs.observe(el));
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }
})();
