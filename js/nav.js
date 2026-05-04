/* ============================================================
   nav.js — Shared navigation
   Injects the top navigation bar into every page so we don't
   have to duplicate markup in each .html file. Highlights the
   active link and shows the signed-in user with role badge.
   ============================================================ */

(function () {
  'use strict';

  /* Inject the nav into <header data-nav> if present. Each page
     declares its current section with `data-current="catalog"` etc. */
  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.querySelector('header[data-nav]');
    if (!mount) return;

    const current = mount.getAttribute('data-current') || '';
    const user = window.AuthService.current();

    /* Auth-required pages (everything except login.html) bounce
       unauthenticated visitors. Login page sets data-skip-auth. */
    if (!user && !mount.hasAttribute('data-skip-auth')) {
      window.AuthService.requireAuth();
      return;
    }

    const links = [
      { key: 'dashboard', href: 'index.html',   label: 'Dashboard' },
      { key: 'catalog',   href: 'catalog.html', label: 'Catalog' }
    ];

    const linksHtml = user ? links.map(l => `
      <a class="nav__link${l.key === current ? ' nav__link--active' : ''}" href="${l.href}">
        ${l.label}
      </a>
    `).join('') : '';

    const userBlock = user ? `
      <div class="nav__user">
        <div class="nav__user-info">
          <span class="nav__user-name">${window.UI.escapeHtml(user.displayName)}</span>
          <span class="nav__user-role nav__user-role--${user.role}">${user.role}</span>
        </div>
        <button type="button" class="btn btn--ghost btn--sm" id="nav-logout">Sign out</button>
      </div>
    ` : '';

    mount.innerHTML = `
      <div class="nav__inner">
        <a class="nav__brand" href="index.html" aria-label="Meridian Public Library home">
          <span class="nav__brand-mark" aria-hidden="true">M</span>
          <span class="nav__brand-text">
            <span class="nav__brand-name">Meridian</span>
            <span class="nav__brand-sub">Public Library</span>
          </span>
        </a>
        <nav class="nav__links" aria-label="Primary">
          ${linksHtml}
        </nav>
        ${userBlock}
      </div>
    `;

    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.AuthService.logout();
        window.location.href = 'login.html';
      });
    }
  });
})();
