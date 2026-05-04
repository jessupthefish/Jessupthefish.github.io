/* ============================================================
   data.js — Seed data for first-time loads.
   This is the initial state. Once the user makes changes,
   data is persisted to localStorage by store.js. To reset
   the system, click "Reset Data" in the dashboard footer.
   ============================================================ */

window.SEED_BOOKS = [
  { id: 'b001', title: 'To Kill a Mockingbird',          author: 'Harper Lee',           isbn: '9780061120084', genre: 'Classic',         year: 1960, available: true,  borrower: null, dueDate: null, addedOn: '2024-09-12' },
  { id: 'b002', title: '1984',                            author: 'George Orwell',        isbn: '9780451524935', genre: 'Fiction',         year: 1949, available: true,  borrower: null, dueDate: null, addedOn: '2024-09-12' },
  { id: 'b003', title: 'The Great Gatsby',                author: 'F. Scott Fitzgerald',  isbn: '9780743273565', genre: 'Classic',         year: 1925, available: false, borrower: 'patron', dueDate: '2026-04-20', addedOn: '2024-09-12' },
  { id: 'b004', title: 'Dune',                            author: 'Frank Herbert',        isbn: '9780441172719', genre: 'Science Fiction', year: 1965, available: true,  borrower: null, dueDate: null, addedOn: '2024-09-15' },
  { id: 'b005', title: 'The Hobbit',                      author: 'J.R.R. Tolkien',       isbn: '9780547928227', genre: 'Fantasy',         year: 1937, available: true,  borrower: null, dueDate: null, addedOn: '2024-09-15' },
  { id: 'b006', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '9780062316097', genre: 'Non-fiction',  year: 2011, available: false, borrower: 'patron', dueDate: '2026-05-15', addedOn: '2024-09-20' },
  { id: 'b007', title: 'Educated',                        author: 'Tara Westover',        isbn: '9780399590504', genre: 'Biography',       year: 2018, available: true,  borrower: null, dueDate: null, addedOn: '2024-09-20' },
  { id: 'b008', title: 'The Silent Patient',              author: 'Alex Michaelides',     isbn: '9781250301697', genre: 'Mystery',         year: 2019, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-01' },
  { id: 'b009', title: 'A Brief History of Time',         author: 'Stephen Hawking',      isbn: '9780553380163', genre: 'Science',         year: 1988, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-01' },
  { id: 'b010', title: 'Pride and Prejudice',             author: 'Jane Austen',          isbn: '9780141439518', genre: 'Romance',         year: 1813, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-05' },
  { id: 'b011', title: 'Beloved',                         author: 'Toni Morrison',        isbn: '9781400033416', genre: 'Fiction',         year: 1987, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-08' },
  { id: 'b012', title: 'The Name of the Wind',            author: 'Patrick Rothfuss',     isbn: '9780756404741', genre: 'Fantasy',         year: 2007, available: false, borrower: 'patron', dueDate: '2026-04-15', addedOn: '2024-10-12' },
  { id: 'b013', title: 'Atomic Habits',                   author: 'James Clear',          isbn: '9780735211292', genre: 'Self-help',       year: 2018, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-15' },
  { id: 'b014', title: 'The Diary of a Young Girl',       author: 'Anne Frank',           isbn: '9780553296983', genre: 'Biography',       year: 1947, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-20' },
  { id: 'b015', title: 'Crime and Punishment',            author: 'Fyodor Dostoevsky',    isbn: '9780486415871', genre: 'Classic',         year: 1866, available: true,  borrower: null, dueDate: null, addedOn: '2024-10-22' },
  { id: 'b016', title: 'The Martian',                     author: 'Andy Weir',            isbn: '9780553418026', genre: 'Science Fiction', year: 2014, available: true,  borrower: null, dueDate: null, addedOn: '2024-11-01' },
  { id: 'b017', title: 'Gone Girl',                       author: 'Gillian Flynn',        isbn: '9780307588371', genre: 'Mystery',         year: 2012, available: true,  borrower: null, dueDate: null, addedOn: '2024-11-04' },
  { id: 'b018', title: 'Meditations',                     author: 'Marcus Aurelius',      isbn: '9780812968255', genre: 'Philosophy',      year: 180,  available: true,  borrower: null, dueDate: null, addedOn: '2024-11-10' },
  { id: 'b019', title: 'The Color Purple',                author: 'Alice Walker',         isbn: '9780156028356', genre: 'Fiction',         year: 1982, available: true,  borrower: null, dueDate: null, addedOn: '2024-11-15' },
  { id: 'b020', title: 'Where the Crawdads Sing',         author: 'Delia Owens',          isbn: '9780735219090', genre: 'Fiction',         year: 2018, available: false, borrower: 'patron', dueDate: '2026-05-08', addedOn: '2024-11-20' },
  { id: 'b021', title: 'Cosmos',                          author: 'Carl Sagan',           isbn: '9780345539434', genre: 'Science',         year: 1980, available: true,  borrower: null, dueDate: null, addedOn: '2024-11-25' },
  { id: 'b022', title: 'The Lean Startup',                author: 'Eric Ries',            isbn: '9780307887894', genre: 'Business',        year: 2011, available: true,  borrower: null, dueDate: null, addedOn: '2024-12-01' },
  { id: 'b023', title: 'Leaves of Grass',                 author: 'Walt Whitman',         isbn: '9780140421996', genre: 'Poetry',          year: 1855, available: true,  borrower: null, dueDate: null, addedOn: '2024-12-08' },
  { id: 'b024', title: 'The Wind-Up Bird Chronicle',      author: 'Haruki Murakami',      isbn: '9780679775430', genre: 'Fiction',         year: 1994, available: true,  borrower: null, dueDate: null, addedOn: '2024-12-15' },
  { id: 'b025', title: 'Guns, Germs, and Steel',          author: 'Jared Diamond',        isbn: '9780393354324', genre: 'History',         year: 1997, available: true,  borrower: null, dueDate: null, addedOn: '2025-01-05' }
];

/* Mock user accounts — for demonstration only.
   In a real app, never store credentials in client-side code. */
window.SEED_USERS = [
  { username: 'admin',  password: 'admin123',  role: 'admin',  displayName: 'Admin', title: 'Head Librarian' },
  { username: 'patron', password: 'patron123', role: 'patron', displayName: 'User',       title: 'Library Member' }
];

/* The complete list of genres used in the catalog. Used to populate
   filter dropdowns and the add/edit form. */
window.GENRES = [
  'Biography', 'Business', 'Children', 'Classic', 'Fantasy', 'Fiction',
  'History', 'Mystery', 'Non-fiction', 'Philosophy', 'Poetry', 'Romance',
  'Science', 'Science Fiction', 'Self-help', 'Thriller'
];
