/* ============================================================
   login.js — Login page logic
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // If already signed in, skip login.
    const existing = window.AuthService.current();
    if (existing) {
      const redirect = window.UI.queryParam('redirect') || 'index.html';
      window.location.href = redirect;
      return;
    }

    const form = document.getElementById('login-form');
    const errorBox = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.classList.add('hidden');
      const username = form.elements.username.value.trim();
      const password = form.elements.password.value;
      const user = window.AuthService.login(username, password);
      if (!user) {
        errorBox.textContent = 'Invalid username or password.';
        errorBox.classList.remove('hidden');
        return;
      }
      const redirect = window.UI.queryParam('redirect') || 'index.html';
      window.location.href = redirect;
    });

    // Clicking a credential row autofills the form.
    document.querySelectorAll('[data-fill]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const [u, p] = el.getAttribute('data-fill').split(':');
        form.elements.username.value = u;
        form.elements.password.value = p;
        form.elements.username.focus();
      });
    });
  });
})();
