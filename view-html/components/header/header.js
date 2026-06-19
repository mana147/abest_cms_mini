(function () {
    'use strict';

    // ===== MOBILE MENU: Auto-close on link click =====
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                const collapseInstance = bootstrap.Collapse.getInstance(mobileMenu);
                if (collapseInstance) {
                    collapseInstance.hide();
                }
            });
        });
    }

    // ===== DROPDOWN: Close on outside click (optional enhancement) =====
    document.addEventListener('click', function (event) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(function (dropdown) {
            const parent = dropdown.closest('.dropdown');
            if (parent && !parent.contains(event.target)) {
                const instance = bootstrap.Dropdown.getInstance(parent.querySelector('.dropdown-toggle'));
                if (instance) {
                    instance.hide();
                }
            }
        });
    });

    // ===== SCROLL REVEAL for Header only =====
    function initHeaderScrollReveal() {
        const header = document.querySelector('header');
        if (!header) return;

        // Add class for scroll effect if needed
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Optional: Add shadow on scroll
    const style = document.createElement('style');
    style.textContent = `
                header.header-scrolled {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: box-shadow 0.3s ease;
                }
                header {
                    transition: box-shadow 0.3s ease;
                }
            `;
    document.head.appendChild(style);

    initHeaderScrollReveal();

    // ===== KEYBOARD ACCESSIBILITY: Close mobile menu on Escape =====
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                const collapseInstance = bootstrap.Collapse.getInstance(mobileMenu);
                if (collapseInstance) {
                    collapseInstance.hide();
                }
            }
        }
    });

    console.log('✅ Header initialized successfully');
})();