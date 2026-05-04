/* ============================================================
   catalog.js — Catalog page logic
   Real-time search, genre & availability filters, sortable
   list, and an "Add book" form (admin only) that lives in
   the same page below the catalog. The form serves as both
   "add" and "edit" via the URL ?edit=<id> — but on this page
   it's always "add"; edits happen on book.html.
   ============================================================ */

(function () {
  'use strict';

  // --- State ----------------------------------------------
  const state = {
    search: '',
    genre: 'all',
    availability: 'all',
    sort: 'title-asc'
  };

  let user = null;

  document.addEventListener('DOMContentLoaded', () => {
    user = window.AuthService.current();
    if (!user) return; // nav.js handles redirect

    setupToolbar();
    setupAddSection();
    render();
  });

  /* -------- Toolbar setup -------------------------------- */
  function setupToolbar() {
    // Populate genre filter dropdown.
    const genreSel = document.getElementById('filter-genre');
    genreSel.innerHTML = '<option value="all">All genres</option>' +
      window.GENRES.map(g => `<option value="${g}">${g}</option>`).join('');

    document.getElementById('filter-search').addEventListener('input', (e) => {
      state.search = e.target.value.trim().toLowerCase();
      render();
    });

    genreSel.addEventListener('change', (e) => {
      state.genre = e.target.value;
      render();
    });

    document.getElementById('filter-availability').addEventListener('change', (e) => {
      state.availability = e.target.value;
      render();
    });

    document.getElementById('filter-sort').addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });

    // Admin-only add button toggles the inline form.
    const addBtn = document.getElementById('catalog-add-btn');
    if (user.role === 'admin') {
      addBtn.classList.remove('hidden');
      addBtn.addEventListener('click', () => {
        const section = document.getElementById('add-book-section');
        section.classList.remove('hidden');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('book-title').focus();
      });
    } else {
      addBtn.remove();
    }
  }

  /* -------- Add-book form (admin only) ------------------- */
  function setupAddSection() {
    const section = document.getElementById('add-book-section');
    if (user.role !== 'admin') {
      section.remove();
      return;
    }

    // Populate genre options in the form select.
    const genreSel = document.getElementById('book-genre');
    genreSel.innerHTML = window.GENRES
      .map(g => `<option value="${g}"${g === 'Fiction' ? ' selected' : ''}>${g}</option>`).join('');

    const form = document.getElementById('add-book-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        title: form.elements.title.value,
        author: form.elements.author.value,
        isbn: form.elements.isbn.value,
        genre: form.elements.genre.value,
        year: form.elements.year.value,
        available: form.elements.available.checked
      };

      // Lightweight validation — rely on HTML required + custom rules.
      if (!validate(form, data)) return;

      const created = window.LibraryStore.create(data);
      window.UI.toast(`Added "${created.title}".`, 'success');
      form.reset();
      form.elements.available.checked = true;
      // Hide the form; the new book will appear in the list.
      section.classList.add('hidden');
      render();
    });

    document.getElementById('cancel-add').addEventListener('click', () => {
      form.reset();
      form.elements.available.checked = true;
      clearFormErrors(form);
      section.classList.add('hidden');
    });
  }

  /* Form validation. Adds .field--invalid on bad fields. */
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

    if (!data.title)  fail('title',  'Title is required.');
    if (!data.author) fail('author', 'Author is required.');
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

  /* -------- Rendering ------------------------------------ */
  function render() {
    const filtered = applyFilters(window.LibraryStore.all());

    // Update count.
    document.getElementById('catalog-count').textContent =
      `${filtered.length} of ${window.LibraryStore.all().length} books`;

    const tbody = document.getElementById('catalog-body');
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6" class="table__empty">
          No books match your filters. Try clearing the search or changing the genre.
        </td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(b => `
      <tr data-id="${window.UI.escapeHtml(b.id)}">
        <td data-label="Title">
          <span class="table__title">${window.UI.escapeHtml(b.title)}</span>
          <span class="table__sub mono">ISBN ${window.UI.escapeHtml(b.isbn)}</span>
        </td>
        <td data-label="Author">${window.UI.escapeHtml(b.author)}</td>
        <td data-label="Genre"><span class="badge badge--genre">${window.UI.escapeHtml(b.genre)}</span></td>
        <td data-label="Year">${b.year}</td>
        <td data-label="Status">${window.UI.statusBadge(b)}</td>
        <td data-label="Actions" class="table__actions">
          <a class="btn btn--ghost btn--sm" href="book.html?id=${encodeURIComponent(b.id)}">View</a>
          ${user.role === 'admin'
            ? `<button class="btn btn--ghost btn--sm" data-action="delete">Delete</button>`
            : ''}
        </td>
      </tr>
    `).join('');

    // Row click → detail page (but not when clicking an action button).
    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return;
        window.location.href = 'book.html?id=' + encodeURIComponent(tr.getAttribute('data-id'));
      });
    });

    // Wire up delete buttons.
    tbody.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const tr = btn.closest('tr');
        const id = tr.getAttribute('data-id');
        const book = window.LibraryStore.findById(id);
        const ok = await window.UI.confirmDialog({
          title: 'Delete this book?',
          message: `"${book.title}" by ${book.author} will be permanently removed from the catalog.`,
          confirmText: 'Delete',
          cancelText: 'Keep',
          danger: true
        });
        if (!ok) return;
        window.LibraryStore.remove(id);
        window.UI.toast(`Deleted "${book.title}".`, 'success');
        render();
      });
    });
  }

  /* -------- Filtering & sorting -------------------------- */
  function applyFilters(books) {
    let out = books;

    if (state.search) {
      const q = state.search;
      out = out.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    }

    if (state.genre && state.genre !== 'all') {
      out = out.filter(b => b.genre === state.genre);
    }

    if (state.availability === 'available') {
      out = out.filter(b => b.available);
    } else if (state.availability === 'checked-out') {
      out = out.filter(b => !b.available);
    }

    out.sort((a, b) => {
      switch (state.sort) {
        case 'title-asc':  return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        case 'author':     return a.author.localeCompare(b.author);
        case 'year-desc':  return b.year - a.year;
        case 'year-asc':   return a.year - b.year;
        case 'recent':     return (b.addedOn || '').localeCompare(a.addedOn || '');
        default:           return 0;
      }
    });

    return out;
  }
})();
