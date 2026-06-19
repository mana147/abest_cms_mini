// Filter tabs (giữ nguyên logic)
        document.querySelectorAll('.sticky-top-72 .btn-link').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.sticky-top-72 .btn-link').forEach(b => {
                    b.classList.remove('text-primary', 'border-bottom-2-primary');
                    b.classList.add('text-on-surface-variant');
                });
                this.classList.add('text-primary', 'border-bottom-2-primary');
                this.classList.remove('text-on-surface-variant');
            });
        });

        // Accordion-like cho details (bootstrap không quản lý details nên tự xử lý)
        document.querySelectorAll('.faq-item details').forEach(detail => {
            detail.addEventListener('toggle', function() {
                const icon = this.querySelector('.expand-icon i');
                if (this.open) {
                    icon.className = 'bi bi-chevron-up';
                } else {
                    icon.className = 'bi bi-chevron-down';
                }
            });
        });
        // Khởi tạo icon cho details đang mở
        document.querySelectorAll('.faq-item details[open]').forEach(detail => {
            const icon = detail.querySelector('.expand-icon i');
            if (icon) icon.className = 'bi bi-chevron-up';
        });

        // SCROLL REVEAL: add IntersectionObserver to reveal sections/cards on scroll
        (function initCourseScrollReveal(){
            try {
                const selectors = [ 'section', '.course-card', '.promotion-gradient', '.course-card .position-relative', '.faq-item', 'header', 'footer' ];
                const elements = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
                const unique = Array.from(new Set(elements)).filter(el => el instanceof HTMLElement && !el.classList.contains('no-reveal'));

                unique.forEach(el => { if (!el.classList.contains('scroll-reveal')) el.classList.add('scroll-reveal'); });

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
                }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

                unique.forEach(el => obs.observe(el));
            } catch (e) {
                // fail silently
                console.error('Scroll reveal init failed', e);
            }
        })();