# Meridian Library

A library catalog and circulation system built as a static site. Everything runs in the browser using HTML, CSS, and JavaScript.

**Live demo:** https://jessupthefish.github.io/

## Overview

Meridian Library is a working circulation system. Librarians can add, edit, and remove books from the catalog, and they can force a return on any checked-out item. Patrons can browse the catalog, search and filter it, and borrow or return books. The dashboard surfaces overdue items and books due in the next several days.

State persists in localStorage. Authentication is mocked using two seeded accounts.

## Demo credentials

| Role   | Username | Password    |
|--------|----------|-------------|
| Admin  | `admin`  | `admin123`  |
| Patron | `patron` | `patron123` |

The login screen has one-click autofill for either account.

## Features

**Catalog**
- Search by title, author, or ISBN
- Filter by genre and availability
- Sort by title, author, or year
- Add, edit, and delete books (admin only)
- Per-book detail view

**Role-based access**
- Admin: full CRUD plus the ability to force-return any checked-out book
- Patron: browse, borrow available books, return books they have borrowed

**Borrow and return workflow**
- Borrowing a book sets a 14-day due date
- Status badges progress from Available, to Checked Out, to Due in N Days, to Due Tomorrow, to Overdue by N Days
- Returning a book clears the borrower and the due date

**Dashboard**
- Live counts of total, available, and checked-out books
- Reminders panel for overdue and due-soon items. Admins see the whole library; patrons see only their own loans.

## Tech stack

- HTML5, CSS3, ES2017 JavaScript
- No frameworks, no build step, no runtime dependencies aside from web fonts
- localStorage for the book collection (key: `meridian.library.books.v1`)
- sessionStorage for the auth session (key: `meridian.library.session.v1`)
- Hosted on GitHub Pages

## Architecture

The site has four pages that share a common navigation bar and a small set of script modules attached to a global `Meridian` namespace.

```
index.html        Dashboard
catalog.html      Browse, search, filter, add
book.html         Detail view, edit, borrow, return
login.html        Mock auth

css/
  base.css        Design tokens, typography, page frame
  layout.css      Top nav, grid systems
  components.css  Buttons, forms, tables, badges, modals, toasts

js/
  data.js         Seed data: 25 books, 2 accounts, genre list
  store.js        LibraryStore: CRUD, borrow/return, stats, persistence
  auth.js         AuthService: login/logout, role checks, route guards
  ui.js           Toast, confirm dialog, date helpers, status badges
  nav.js          Shared navigation injection and auth gate
  dashboard.js    Page controller for index.html
  catalog.js      Page controller for catalog.html
  book.js         Page controller for book.html
  login.js        Page controller for login.html
```

Each page loads only the modules it needs. The store and auth modules are pure data layers with no DOM coupling, so the UI modules read from them and render. This separation keeps the page controllers thin and would let the data layer be swapped for a real backend without touching the views.

## Design notes

The visual style leans toward a physical archive rather than the standard SaaS dashboard look. The palette is a warm cream (`#f4ede0`) with a single deep oxblood accent (`#7a2e2e`). Typography pairs Fraunces (display serif) with IBM Plex Sans (body) and IBM Plex Mono, which is used for ISBNs and other metadata. Border radii are kept small, between 2 and 6 pixels, and shadows are subtle.

The layout is responsive. At viewport widths under 720 pixels the navigation collapses, and the catalog table converts to stacked cards.

## Seed data

The seeded catalog contains 25 books across fiction, science fiction, fantasy, biography, philosophy, history, business, and other genres. Four of those books are pre-checked-out: two overdue, two due soon. The dashboard reminders show real content the moment you log in as admin.

A "Reset demo data" link at the bottom of the dashboard restores the seed at any time.

## Known limitations

- Authentication is mocked entirely on the client. This is not a real auth system.
- Data is stored per-browser. Clearing site data resets everything.
- The system assumes one user at a time per browser. There is no concurrency handling and no conflict resolution.
- Web fonts load from the Google Fonts CDN. The font stack falls back gracefully if the CDN is unreachable.

## Running locally

Any static file server will work. From the project root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
