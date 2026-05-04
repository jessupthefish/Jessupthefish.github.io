/* ============================================================
   ui.js — Shared UI helpers
   Lightweight utilities used across pages: toast notifications,
   a confirmation dialog (replaces window.confirm so we can
   match the visual style), date formatting, and HTML escaping.
   ============================================================ */

(function () {
  'use strict';

  /* --- HTML escaping --------------------------------------- */
  /* Escape user-controlled strings before injecting via innerHTML. */
  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* --- Toast notifications --------------------------------- */
  /* Lazily creates the toast container on first use. */
  function ensureToastContainer() {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  /* Show a toast. variant: 'success' | 'error' | 'info' (default). */
  function toast(message, variant) {
    const container = ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast toast--' + (variant || 'info');
    t.textContent = message;
    container.appendChild(t);
    // Trigger transition.
    requestAnimationFrame(() => t.classList.add('toast--visible'));
    // Remove after timeout.
    setTimeout(() => {
      t.classList.remove('toast--visible');
      t.addEventListener('transitionend', () => t.remove(), { once: true });
    }, 3200);
  }

  /* --- Confirmation dialog --------------------------------- */
  /* Promise-based replacement for window.confirm so we can
     style it to match the rest of the system. */
  function confirmDialog({ title, message, confirmText, cancelText, danger }) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'confirm-title');

      overlay.innerHTML = `
        <div class="modal">
          <h2 class="modal__title" id="confirm-title">${escapeHtml(title || 'Confirm')}</h2>
          <p class="modal__message">${escapeHtml(message || '')}</p>
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" data-action="cancel">
              ${escapeHtml(cancelText || 'Cancel')}
            </button>
            <button type="button" class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-action="confirm">
              ${escapeHtml(confirmText || 'Confirm')}
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const cleanup = (result) => {
        overlay.remove();
        document.removeEventListener('keydown', onKeydown);
        resolve(result);
      };
      const onKeydown = (e) => {
        if (e.key === 'Escape') cleanup(false);
        if (e.key === 'Enter')  cleanup(true);
      };

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cleanup(false);
        const action = e.target.getAttribute && e.target.getAttribute('data-action');
        if (action === 'confirm') cleanup(true);
        if (action === 'cancel')  cleanup(false);
      });
      document.addEventListener('keydown', onKeydown);

      // Focus the confirm button for keyboard users.
      overlay.querySelector('[data-action="confirm"]').focus();
    });
  }

  /* --- Date helpers ---------------------------------------- */
  /* Format a YYYY-MM-DD string as "Apr 20, 2026". */
  function formatDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y) return iso;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });
  }

  /* Days between today and an ISO due date. Negative = overdue. */
  function daysUntilDue(iso) {
    if (!iso) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = iso.split('-').map(Number);
    const due = new Date(y, m - 1, d);
    return Math.round((due - today) / (1000 * 60 * 60 * 24));
  }

  /* Render a status badge for a book. Returns an HTML string. */
  function statusBadge(book) {
    if (book.available) {
      return '<span class="badge badge--available">Available</span>';
    }
    const days = daysUntilDue(book.dueDate);
    if (days !== null && days < 0) {
      return `<span class="badge badge--overdue">Overdue · ${Math.abs(days)}d</span>`;
    }
    if (days !== null && days <= 3) {
      return `<span class="badge badge--due-soon">Due in ${days}d</span>`;
    }
    return '<span class="badge badge--checked-out">Checked out</span>';
  }

  /* Read URL query param. */
  function queryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  /* Expose. */
  window.UI = {
    escapeHtml,
    toast,
    confirmDialog,
    formatDate,
    daysUntilDue,
    statusBadge,
    queryParam
  };
})();
