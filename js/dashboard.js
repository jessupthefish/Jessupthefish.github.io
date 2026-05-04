/* ============================================================
   dashboard.js — Home page logic
   Role-aware: admins see system-wide stats and overdue books;
   patrons see their checkouts and personal due-date reminders.
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Auth gate handled by nav.js, but we double-check for safety.
    const user = window.AuthService.current();
    if (!user) return;

    renderGreeting(user);
    renderStats();
    renderReminders(user);
  });

  /* Greeting & eyebrow */
  function renderGreeting(user) {
    const greetingEl = document.getElementById('dash-greeting');
    const subEl = document.getElementById('dash-sub');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    const tod = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const firstName = user.displayName.split(' ')[0];
    greetingEl.textContent = `${tod}, ${firstName}.`;

    if (user.role === 'admin') {
      subEl.textContent = 'Here is the current state of the collection. Use the catalog to manage holdings.';
    } else {
      subEl.textContent = 'Browse the catalog, manage your checkouts, and watch your due dates here.';
    }
  }

  /* Stat tiles */
  function renderStats() {
    const stats = window.LibraryStore.stats();
    const target = document.getElementById('dash-stats');
    if (!target) return;

    const tiles = [
      { label: 'Total holdings',  value: stats.total,      hint: 'Books in catalog' },
      { label: 'Available now',   value: stats.available,  hint: 'Ready to borrow', accent: 'success' },
      { label: 'Currently out',   value: stats.checkedOut, hint: 'On loan', accent: 'info' },
      { label: 'Overdue items',   value: stats.overdue,    hint: 'Past due date',
        accent: stats.overdue > 0 ? 'danger' : 'subtle' }
    ];

    target.innerHTML = tiles.map(t => `
      <div class="stat ${t.accent === 'danger' ? 'stat--danger' : t.accent === 'success' ? 'stat--accent' : ''}">
        <div class="stat__label">${window.UI.escapeHtml(t.label)}</div>
        <div class="stat__value">${t.value}</div>
        <div class="stat__hint">${window.UI.escapeHtml(t.hint)}</div>
      </div>
    `).join('');
  }

  /* Reminder list — varies by role */
  function renderReminders(user) {
    const target = document.getElementById('dash-reminders');
    const titleEl = document.getElementById('dash-reminders-title');
    if (!target) return;

    const today = new Date().toISOString().slice(0, 10);
    let books;
    if (user.role === 'admin') {
      titleEl.textContent = 'All loaned items';
      books = window.LibraryStore.all().filter(b => !b.available);
    } else {
      titleEl.textContent = 'Your checkouts';
      books = window.LibraryStore.borrowedBy(user.username);
    }

    // Sort by due date ascending so overdue/soon-due float to the top.
    books.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

    if (books.length === 0) {
      target.innerHTML = `
        <p class="muted center" style="padding: 2rem 0;">
          ${user.role === 'admin'
            ? 'No items are currently on loan.'
            : 'You have no books checked out. Visit the catalog to borrow one.'}
        </p>`;
      return;
    }

    target.innerHTML = books.map(b => {
      const days = window.UI.daysUntilDue(b.dueDate);
      let dueText, dueClass;
      if (days < 0) {
        dueText = `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`;
        dueClass = 'badge--overdue';
      } else if (days <= 3) {
        dueText = `Due in ${days} day${days === 1 ? '' : 's'}`;
        dueClass = 'badge--due-soon';
      } else {
        dueText = `Due ${window.UI.formatDate(b.dueDate)}`;
        dueClass = 'badge--checked-out';
      }
      const borrowerLine = user.role === 'admin'
        ? `Borrowed by ${window.UI.escapeHtml(b.borrower)}`
        : window.UI.escapeHtml(b.author);

      return `
        <a class="reminder" href="book.html?id=${encodeURIComponent(b.id)}" style="text-decoration:none;color:inherit;">
          <div>
            <div class="reminder__title">${window.UI.escapeHtml(b.title)}</div>
            <div class="reminder__sub">${borrowerLine}</div>
          </div>
          <span class="badge ${dueClass}">${window.UI.escapeHtml(dueText)}</span>
        </a>`;
    }).join('');
  }
})();
