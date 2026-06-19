(function () {
    'use strict';

    // ===== COOKIE CONSENT =====
    const cookieBtn = document.querySelector('.cookie-consent-btn');
    const cookieBox = document.querySelector('.cookie-box');

    if (cookieBtn && cookieBox) {
        // Check if user already accepted
        const cookieAccepted = localStorage.getItem('cookieConsent');

        if (cookieAccepted === 'true') {
            cookieBox.style.display = 'none';
        }

        cookieBtn.addEventListener('click', function () {
            // Save consent
            localStorage.setItem('cookieConsent', 'true');

            // Animate out
            cookieBox.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            cookieBox.style.opacity = '0';
            cookieBox.style.transform = 'translateY(10px)';

            setTimeout(function () {
                cookieBox.style.display = 'none';
            }, 400);

            // Optional: Send analytics event
            console.log('✅ Cookie consent accepted');
        });
    }

    // ===== SCROLL REVEAL for Footer =====
    function initScrollReveal() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Add scroll-reveal class
        if (!footer.classList.contains('scroll-reveal')) {
            footer.classList.add('scroll-reveal');
        }

        if (!('IntersectionObserver' in window)) {
            footer.classList.add('reveal-active');
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(footer);
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    // ===== SOCIAL ICON TRACKING =====
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(function (icon) {
        icon.addEventListener('click', function (e) {
            const platform = this.querySelector('i')?.className || 'unknown';
            console.log(`🔗 Social icon clicked: ${platform}`);
            // You can add analytics tracking here
        });
    });

    // ===== FOOTER LINK TRACKING =====
    const footerLinks = document.querySelectorAll('.footer-link, .footer-bottom-link');
    footerLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const linkText = this.textContent.trim();
            console.log(`🔗 Footer link clicked: ${linkText}`);
            // You can add analytics tracking here
        });
    });

    // ===== CTA BUTTON TRACKING =====
    const ctaBtn = document.querySelector('.btn-telos-purple');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function () {
            console.log('🎯 CTA Button clicked: Đăng ký ngay');
            // You can add analytics tracking here
        });
    }

    // ===== RESPONSIVE: Close mobile menu when footer link clicked =====
    // (Only if footer is used within a page with mobile menu)

    console.log('✅ Footer initialized successfully');
})();