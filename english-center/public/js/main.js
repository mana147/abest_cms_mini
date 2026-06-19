document.addEventListener('DOMContentLoaded', () => {
  // Auto-hide flash alerts after 4s
  document.querySelectorAll('.admin-content > .alert, .flash-container .alert').forEach((alert) => {
    setTimeout(() => {
      alert.classList.remove('show');
      alert.addEventListener('transitionend', () => alert.remove());
    }, 4000);
  });

  // Confirm before destructive form submits
  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const message = form.getAttribute('data-confirm') || 'Bạn có chắc chắn muốn thực hiện hành động này?';
      if (!window.confirm(message)) e.preventDefault();
    });
  });

  // Thumbnail preview on file input change
  document.querySelectorAll('input[type="file"][data-preview]').forEach((input) => {
    input.addEventListener('change', () => {
      const previewEl = document.getElementById(input.getAttribute('data-preview'));
      if (!previewEl || !input.files || !input.files[0]) return;
      const reader = new FileReader();
      reader.onload = (e) => { previewEl.src = e.target.result; previewEl.style.display = 'block'; };
      reader.readAsDataURL(input.files[0]);
    });
  });

  // Mobile sidebar toggle (admin)
  const sidebarToggle = document.getElementById('sidebarToggle');
  const adminSidebar = document.getElementById('adminSidebar');
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => adminSidebar.classList.toggle('open'));
  }
});
