# Meridian Public Library — Catalog System

A multi-page static library management system built with vanilla HTML, CSS, and JavaScript. Designed for direct deployment to GitHub Pages — no build step, no dependencies.

## Demo accounts

| Username | Password    | Role   | Notes                                           |
|----------|-------------|--------|-------------------------------------------------|
| `admin`  | `admin123`  | Admin  | Can add, edit, delete books; mark items returned |
| `patron` | `patron123` | Patron | Can borrow available books and return their own  |

Click a credential row on the login screen to autofill.

## Pages

```
index.html      Dashboard       — stats and reminders (role-aware)
catalog.html    Catalog         — search, filter, list, add (admin)
book.html       Book detail     — view, edit, delete, borrow, return
login.html      Sign in         — mock authentication
```

All non-login pages bounce to the login page if no session is active.

## Features

### Core (required)
- ✅ **Add a book** — Inline form on the catalog page (admin only) with title, author, ISBN, genre, publication year, and availability.
- ✅ **Edit a book** — Pre-populated form on `book.html` (admin only); validates ISBN and year.
- ✅ **Delete a book** — Confirmation dialog with the book's title. Available from both the catalog row actions and the detail page.
- ✅ **Search & filter** — Real-time text search across title, author, and ISBN. Genre filter, availability filter, and six sort options.
- ✅ **Book detail view** — Dedicated page per book with full metadata and loan status panel.

### Stretch goals (all implemented)
- ✅ **Mock authentication** — Hardcoded admin and patron accounts in `js/data.js`. Session in `sessionStorage`. Role gates control which actions are visible.
- ✅ **Borrow / return workflow** — Patrons borrow available books (14-day loan period); they can return their own. Admins can force-return any book.
- ✅ **Due-date reminders** — Dashboard surfaces overdue and soon-due items with color-coded badges. Catalog table shows a status badge that escalates from "Available" → "Checked out" → "Due in N days" → "Overdue · Nd".

## File structure

```
library-system/
├── index.html              Dashboard page
├── catalog.html            Catalog browse/search page
├── book.html               Book detail / edit page
├── login.html              Login page
├── README.md               This file
│
├── css/
│   ├── base.css            Design tokens, reset, typography, page frame
│   ├── layout.css          Top navigation, grid systems
│   └── components.css      Buttons, forms, tables, badges, modals, toasts
│
└── js/
    ├── data.js             Seed data: 25 books, 2 user accounts, genre list
    ├── store.js            LibraryStore — CRUD with localStorage persistence
    ├── auth.js             AuthService — mock login / logout / role checks
    ├── ui.js               Shared UI helpers (toasts, dialogs, formatting)
    ├── nav.js              Injects shared navigation on every page
    ├── login.js            Login page logic
    ├── dashboard.js        Dashboard rendering
    ├── catalog.js          Catalog table, filters, add-book form
    └── book.js             Book detail view, edit form, borrow/return
```

## Data persistence

Books are persisted to `localStorage` under the key `meridian.library.books.v1`. Edits, additions, deletions, and borrow/return actions all survive a page refresh. The dashboard footer has a **Reset demo data** link to restore the original 25-book seed.

The auth session lives in `sessionStorage` (cleared when the browser closes), which is appropriate for a shared library workstation.

## Design notes

- **Type pairing:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif, used at high optical-size for the wordmark and headings) + [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (UI body) + IBM Plex Mono (ISBNs and other technical metadata).
- **Palette:** Warm cream paper (`#f4ede0`) ground with deep oxblood (`#7a2e2e`) as the single accent. Status colors are muted variants of green, amber, and red — never saturated.
- **Layout:** Generous whitespace, hairline borders, restrained shadows. Tables use uppercase tracked-out headings reminiscent of card catalogs.
- **Responsive:** The catalog table collapses to stacked cards under 720px; the navigation reflows; the form grids reduce to single-column under 600px.
- **Accessibility:** Semantic HTML (`<header>`, `<main>`, `<section>`, `<aside>`, `<dl>`), labeled form fields, ARIA roles on the modal and toast region, focus-visible rings, and an Escape-to-close pattern on dialogs.

## Deployment

This is a pure static site. To deploy to GitHub Pages:

1. Push the `library-system/` contents to the root of a GitHub repository.
2. In the repo settings, enable Pages and point it at the `main` branch root.
3. Visit `https://<your-username>.github.io/<repo-name>/login.html` (or `index.html` — it'll redirect to login).

To run locally, just open `login.html` directly in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/login.html
```

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses no transpilation; relies on standard ES2017+ features (template literals, spread, async/await, optional chaining).
