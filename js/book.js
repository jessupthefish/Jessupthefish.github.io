/* ============================================================
   book.js — Book detail page
   View / edit / delete a single book, plus borrow/return for
   patrons. Edit form is pre-populated from the existing book.
   ============================================================ */

(function () {
  'use strict';

  let user = null;
  let book = null;
  let editing = false;

  document.addEventListener('DOMContentLoaded', () => {
    user = window.AuthService.current();
    if (!user) return;

    const id = window.UI.queryParam('id');
    book = id ? window.LibraryStore.findById(id) : null;

    if (!book) {
      renderNotFound();
      return;
    }

    populateGenreOptions();
    renderView();
  });

  function populateGenreOptions() {
    const sel = document.getElementById('edit-genre');
    sel.innerHTML = window.GENRES.map(g => `<option value="${g}">${g}</option>`).join('');
  }

  /* -------- Not-found state ------------------------------ */
  function renderNotFound() {
    document.getElementById('book-view').classList.add('hidden');
    document.getElementById('book-edit').classList.add('hidden');
    document.getElementById('book-not-found').classList.remove('hidden');
  }

  /* -------- View mode ------------------------------------ */
  function renderView() {
    document.getElementById('book-view').classList.remove('hidden');
    document.getElementById('book-edit').classList.add('hidden');
    document.title = `${book.title} — Meridian Public Library`;

    document.getElementById('view-title').textContent = book.title;

    // Author with italic display-font emphasis.
    const authorEl = document.getElementById('view-author');
    authorEl.innerHTML = `by <em>${window.UI.escapeHtml(book.author)}</em>`;

    document.getElementById('view-genre').textContent = book.genre;
    document.getElementById('view-year').textContent = book.year;
    document.getElementById('view-isbn').textContent = book.isbn;
    document.getElementById('view-added').textContent = window.UI.formatDate(book.addedOn);
    document.getElementById('view-status').innerHTML = window.UI.statusBadge(book);

    // Borrower / due-date row only shown when checked out.
    const loanRow = document.getElementById('view-loan-row');
    if (!book.available && book.borrower) {
      loanRow.classList.remove('hidden');
      document.getElementById('view-borrower').textContent = book.borrower;
      document.getElementById('view-due').textContent = window.UI.formatDate(book.dueDate);
    } else {
      loanRow.classList.add('hidden');
    }

    renderActions();
  }

  /* Render the action buttons depending on role and book state. */
  function renderActions() {
    const bar = document.getElementById('view-actions');
    const buttons = [];

    if (user.role === 'patron') {
      if (book.available) {
        buttons.push(`<button class="btn btn--primary" data-action="borrow">Borrow this book</button>`);
      } else if (book.borrower === user.username) {
        buttons.push(`<button class="btn btn--primary" data-action="return">Return book</button>`);
      } else {
        buttons.push(`<span class="muted" style="align-self:center;">Currently checked out — check back after ${window.UI.escapeHtml(window.UI.formatDate(book.dueDate))}.</span>`);
      }
    }

    if (user.role === 'admin') {
      buttons.push(`<button class="btn btn--secondary" data-action="edit">Edit details</button>`);
      if (!book.available) {
        buttons.push(`<button class="btn btn--secondary" data-action="force-return">Mark returned</button>`);
      }
      buttons.push(`<button class="btn btn--ghost" data-action="delete">Delete</button>`);
    }

    bar.innerHTML = buttons.join('');

    // Wire actions.
    bar.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => handleAction(btn.getAttribute('data-action')));
    });
  }

  async function handleAction(action) {
    if (action === 'edit') {
      enterEditMode();
      return;
    }

    if (action === 'borrow') {
      const updated = window.LibraryStore.borrow(book.id, user.username);
      if (updated) {
        book = updated;
        window.UI.toast(`You've borrowed "${book.title}". Due ${window.UI.formatDate(book.dueDate)}.`, 'success');
        renderView();
      }
      return;
    }

    if (action === 'return' || action === 'force-return') {
      const updated = window.LibraryStore.returnBook(book.id);
      if (updated) {
        book = updated;
        window.UI.toast(`"${book.title}" has been returned.`, 'success');
        renderView();
      }
      return;
    }

    if (action === 'delete') {
      const ok = await window.UI.confirmDialog({
        title: 'Delete this book?',
        message: `"${book.title}" by ${book.author} will be permanently removed from the catalog. This cannot be undone.`,
        confirmText: 'Delete permanently',
        cancelText: 'Keep',
        danger: true
      });
      if (!ok) return;
      window.LibraryStore.remove(book.id);
      window.UI.toast(`Deleted "${book.title}".`, 'success');
      // After delete, return to catalog.
      setTimeout(() => { window.location.href = 'catalog.html'; }, 600);
      return;
    }
  }

  /* -------- Edit mode ------------------------------------ */
  function enterEditMode() {
    editing = true;
    document.getElementById('book-view').classList.add('hidden');
    const editEl = document.getElementById('book-edit');
    editEl.classList.remove('hidden');

    const form = document.getElementById('edit-form');
    form.elements.title.value = book.title;
    form.elements.author.value = book.author;
    form.elements.isbn.value = book.isbn;
    form.elements.genre.value = book.genre;
    form.elements.year.value = book.year;
    form.elements.available.checked = book.available;

    // If currently checked out, "available" toggle changes status —
    // explain the implication in a hint.
    document.getElementById('edit-available-hint').textContent = book.available
      ? 'Uncheck only if you need to remove this book from circulation.'
      : 'Checking this box will mark the book returned and clear borrower info.';

    form.elements.title.focus();
    form.elements.title.select();
    editEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // (Re)bind submit & cancel each time we enter edit mode.
    form.onsubmit = onEditSubmit;
    document.getElementById('cancel-edit').onclick = () => {
      editing = false;
      clearFormErrors(form);
      renderView();
    };
  }

  function onEditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.elements.title.value,
      author: form.elements.author.value,
      isbn: form.elements.isbn.value,
      genre: form.elements.genre.value,
      year: form.elements.year.value,
      available: form.elements.available.checked
    };

    if (!validate(form, data)) return;

    const patch = { ...data };
    // If admin marked the book available, clear borrower data.
    if (data.available && !book.available) {
      patch.borrower = null;
      patch.dueDate  = null;
    }

    const updated = window.LibraryStore.update(book.id, patch);
    if (updated) {
      book = updated;
      window.UI.toast(`Updated "${book.title}".`, 'success');
      editing = false;
      renderView();
    }
  }

  function validate(form, data) {
    clearFormErrors(form);
    let ok = true;
    const fail = (name, msg) => {
      const wrap = form.querySelector(`[data-field="${name}"]`);
      if (wrap) {
        wrap.classList.add('field--invalid');
        const errEl = wrap.querySelector('.field__error');
        if (errEl) errEl.textContent = msg;
      }
      ok = false;
    };

    if (!data.title.trim())  fail('title',  'Title is required.');
    if (!data.author.trim()) fail('author', 'Author is required.');
    if (!data.isbn || !/^[\d\-xX]{10,17}$/.test(data.isbn)) {
      fail('isbn', 'Enter a valid ISBN (10–13 digits).');
    }
    const year = parseInt(data.year, 10);
    const thisYear = new Date().getFullYear();
    if (!year || year < 1 || year > thisYear + 1) {
      fail('year', `Enter a year between 1 and ${thisYear + 1}.`);
    }
    return ok;
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.field--invalid').forEach(f => f.classList.remove('field--invalid'));
  }
})();
