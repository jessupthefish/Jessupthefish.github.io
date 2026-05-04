/* ============================================================
   store.js — LibraryStore
   Single source of truth for book data. Wraps localStorage so
   pages can read/write without thinking about persistence.
   Falls back to in-memory operation if localStorage is blocked.
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'meridian.library.books.v1';

  /* Try to read books from localStorage; if missing or corrupt,
     seed from data.js. */
  function loadBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // First load — seed from SEED_BOOKS and persist.
        const seeded = JSON.parse(JSON.stringify(window.SEED_BOOKS));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('LibraryStore: localStorage unavailable, using in-memory copy.', err);
      return JSON.parse(JSON.stringify(window.SEED_BOOKS));
    }
  }

  /* Persist the in-memory books list back to localStorage. */
  function saveBooks(books) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (err) {
      console.warn('LibraryStore: could not persist to localStorage.', err);
    }
  }

  /* Generate a new unique book ID. Looks at existing IDs to
     avoid collisions even after deletes. */
  function nextBookId(books) {
    let max = 0;
    for (const b of books) {
      const n = parseInt(String(b.id).replace(/^b/, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return 'b' + String(max + 1).padStart(3, '0');
  }

  /* In-memory cache. Always re-read at construction so pages
     pick up changes made on other pages. */
  let books = loadBooks();

  const LibraryStore = {
    /* Read all books (defensive copy so callers can't mutate). */
    all() {
      return books.map(b => ({ ...b }));
    },

    /* Find a single book by ID, or null. */
    findById(id) {
      const b = books.find(x => x.id === id);
      return b ? { ...b } : null;
    },

    /* Create a new book. Accepts a partial book object;
       generates ID and added-on date. */
    create(input) {
      const newBook = {
        id: nextBookId(books),
        title: (input.title || '').trim(),
        author: (input.author || '').trim(),
        isbn: (input.isbn || '').trim(),
        genre: input.genre || 'Fiction',
        year: parseInt(input.year, 10) || new Date().getFullYear(),
        available: input.available !== false,
        borrower: null,
        dueDate: null,
        addedOn: new Date().toISOString().slice(0, 10)
      };
      books.push(newBook);
      saveBooks(books);
      return { ...newBook };
    },

    /* Update an existing book. Only fields present on `patch`
       are changed. Returns the updated book or null if not found. */
    update(id, patch) {
      const idx = books.findIndex(b => b.id === id);
      if (idx === -1) return null;
      const updated = { ...books[idx] };
      if ('title' in patch)     updated.title     = patch.title.trim();
      if ('author' in patch)    updated.author    = patch.author.trim();
      if ('isbn' in patch)      updated.isbn      = patch.isbn.trim();
      if ('genre' in patch)     updated.genre     = patch.genre;
      if ('year' in patch)      updated.year      = parseInt(patch.year, 10) || updated.year;
      if ('available' in patch) updated.available = !!patch.available;
      if ('borrower' in patch)  updated.borrower  = patch.borrower;
      if ('dueDate' in patch)   updated.dueDate   = patch.dueDate;
      books[idx] = updated;
      saveBooks(books);
      return { ...updated };
    },

    /* Remove a book by ID. Returns true if removed, false if not found. */
    remove(id) {
      const idx = books.findIndex(b => b.id === id);
      if (idx === -1) return false;
      books.splice(idx, 1);
      saveBooks(books);
      return true;
    },

    /* Check out a book to a username. Sets due date 14 days from today. */
    borrow(id, username) {
      const book = books.find(b => b.id === id);
      if (!book || !book.available) return null;
      const due = new Date();
      due.setDate(due.getDate() + 14);
      return this.update(id, {
        available: false,
        borrower: username,
        dueDate: due.toISOString().slice(0, 10)
      });
    },

    /* Return a book — clear borrower and due date, mark available. */
    returnBook(id) {
      return this.update(id, {
        available: true,
        borrower: null,
        dueDate: null
      });
    },

    /* Books this user currently has checked out. */
    borrowedBy(username) {
      return books
        .filter(b => !b.available && b.borrower === username)
        .map(b => ({ ...b }));
    },

    /* Aggregate counts for dashboard display. */
    stats() {
      const today = new Date().toISOString().slice(0, 10);
      const total = books.length;
      const available = books.filter(b => b.available).length;
      const checkedOut = total - available;
      const overdue = books.filter(b =>
        !b.available && b.dueDate && b.dueDate < today
      ).length;
      return { total, available, checkedOut, overdue };
    },

    /* Reset to original seed data. Useful for demos. */
    reset() {
      books = JSON.parse(JSON.stringify(window.SEED_BOOKS));
      saveBooks(books);
    },

    /* Reload from localStorage — useful if data may have changed
       in another tab. Currently called on page load implicitly. */
    refresh() {
      books = loadBooks();
    }
  };

  // Expose globally.
  window.LibraryStore = LibraryStore;
})();
