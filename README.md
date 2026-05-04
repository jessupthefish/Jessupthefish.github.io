# Meridian Library

A static, multi-page library management system that runs entirely in the browser — no backend, no build step, no frameworks.

**Live demo:** https://jessupthefish.github.io/

## Overview

Meridian Library is a small but complete circulation system. A librarian (admin) can add, edit, and remove books from the catalog and force-return checked-out items. A patron can browse and search the catalog, borrow available books, and return books they've borrowed. The dashboard surfaces overdue items and books due in the next several days.

The project is implemented with vanilla HTML, CSS, and JavaScript. State persists in `localStorage`; auth is mocked with two seeded accounts.

## Demo credentials

| Role    | Username | Password    |
|---------|----------|-------------|
| Admin   | `admin`  | `admin123`  |
| Patron  | `patron` | `patron123` |

The login screen has one-click autofill for either account.

## Features

**Catalog**
- Search across title, author, and ISBN
- Filter by genre and availability
- Sort by title, author, or year
- Add, edit, and delete books (admin)
- Per-book detail view

**Role-based access**
- *Admin:* full CRUD plus the ability to force-return any checked-out book
- *Patron:* browse, borrow available books, return books they've borrowed

**Borrow / return workflow**
- Borrowing sets a 14-day due date
- Status badges escalate: *Available* → *Checked out* → *Due in N days* → *Due tomorrow* → *Overdue · N days*
- Returning clears the borrower and due date

**Dashboard**
- Live counts of total, available, and checked-out books
- Reminders panel showing overdue and due-soon items, scoped to the viewer's role: admin sees the whole library, patron sees only their own loans

## Tech stack

- HTML5, CSS3, ES2017 JavaScript
- No frameworks, no build step, no runtime dependencies except web fonts
- `localStorage` for the book collection (key: `meridian.library.books.v1`)
- `sessionStorage` for the auth session (key: `meridian.library.session.v1`)
- Hosted on GitHub Pages

## Architecture

The site is four pages sharing a common navigation bar and a small library of script modules attached to a global `Meridian` namespace.

```
index.html        Dashboard
catalog.html      Browse / search / filter / add
book.html         Detail view, edit, borrow, return
login.html        Mock auth

css/
  base.css        Design tokens, typography, page frame
  layout.css      Top nav, grid systems
  components.css  Buttons, forms, tables, badges, modals, toasts

js/
  data.js         Seed data — 25 books, 2 accounts, genre list
  store.js        LibraryStore — CRUD, borrow/return, stats, persistence
  auth.js         AuthService — login/logout, role checks, route guards
  ui.js           Toast, confirm dialog, date helpers, status badges
  nav.js          Shared navigation injection and auth gate
  dashboard.js    Page controller — index.html
  catalog.js      Page controller — catalog.html
  book.js         Page controller — book.html
  login.js        Page controller — login.html
```

Each page loads only the modules it needs. The store and auth modules are pure data layers — they expose methods and never touch the DOM. UI modules read from them and render. This keeps page controllers thin and the data layer trivially swappable for a real backend later.

## Design notes

The visual direction is deliberately *not* a generic dashboard look. The palette is warm cream (`#f4ede0`) with a deep oxblood accent (`#7a2e2e`), pulling from the aesthetic of physical archives and library card catalogs. Typography pairs **Fraunces** (display serif) with **IBM Plex Sans** (body) and **IBM Plex Mono** (used for ISBNs and metadata). Radii are tight (2–6px) and shadows are subtle — the goal was institutional, not playful.

Layout is responsive: navigation collapses and catalog rows convert to stacked cards below 720px.

## Seed data

The seeded catalog contains 25 books spanning fiction, sci-fi, fantasy, biography, philosophy, history, business, and more. Four are pre-checked-out — two overdue, two due-soon — so the dashboard reminders display real content from the moment you log in as admin.

A "Reset demo data" link at the bottom of the dashboard restores the seed at any time.

## Known limitations

- Auth is mocked entirely client-side; this is not a real authentication system.
- Data is per-browser; clearing site data resets everything.
- Single-user assumption — no concurrency handling, no conflict resolution.
- Web fonts load from the Google Fonts CDN; the font stack falls back gracefully if the CDN is blocked.

## Running locally

Any static file server will do. From the project root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
