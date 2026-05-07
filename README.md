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
- localStorage for the book collection (key: `meridian.library.books.v1`)
- sessionStorage for the auth session (key: `meridian.library.session.v1`)


