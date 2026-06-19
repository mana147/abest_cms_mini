(function () {
    const form = document.getElementById('registerTestForm');
    const alertBox = document.getElementById('registerTestAlert');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // lấy giá trị
        const fullName = document.getElementById('fullNameTest').value.trim();
        const email = document.getElementById('emailTest').value.trim();
        const phone = document.getElementById('phoneTest').value.trim();

        // kiểm tra đơn giản
        if (!fullName || !email || !phone) {
            alertBox.className = 'alert alert-danger mt-3';
            alertBox.textContent = 'Vui lòng điền đầy đủ thông tin.';
            alertBox.classList.remove('d-none');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alertBox.className = 'alert alert-danger mt-3';
            alertBox.textContent = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.';
            alertBox.classList.remove('d-none');
            return;
        }

        // nếu hợp lệ
        alertBox.className = 'alert alert-success mt-3';
        alertBox.textContent = `✅ Cảm ơn ${fullName}! Chúng tôi sẽ liên hệ với bạn qua ${email} hoặc ${phone} trong thời gian sớm nhất.`;
        alertBox.classList.remove('d-none');

        // (tuỳ chọn) reset form
        form.reset();

        // ẩn thông báo sau 6 giây
        setTimeout(() => {
            alertBox.classList.add('d-none');
        }, 6000);
    });

    function initScrollReveal() {
        const targets = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('header'),
            ...document.querySelectorAll('footer'),
            ...document.querySelectorAll('.card'),
            ...document.querySelectorAll('.mobile-menu-wrap'),
        ];

        const revealElements = Array.from(new Set(targets))
            .filter((el) => el instanceof HTMLElement)
            .filter((el) => !el.classList.contains('no-reveal'));

        revealElements.forEach((el) => {
            if (!el.classList.contains('scroll-reveal')) {
                el.classList.add('scroll-reveal');
            }
        });

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach((el) => el.classList.add('reveal-active'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px',
        });

        revealElements.forEach((el) => observer.observe(el));
    }

    initScrollReveal();
})();