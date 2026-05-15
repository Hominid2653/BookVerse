# BookVerse

BookVerse is a React mini-project for discovering books, viewing book details, previewing available content, and managing a personal reading library in the browser.

The app uses the Open Library API for real book data and browser `localStorage` for saved books, liked books, reading status, favorites, and recommendation preferences.

## Project Overview

BookVerse was built to give readers a simple, account-free way to:

- Search for books.
- View detailed book information.
- Preview book content where available.
- Save books into a personal library.
- Track reading progress.
- Like books to improve recommendations.

The project focuses on modular React components, clean routing, persistent browser storage, responsive UI, and unit/component testing with Vitest.

## Achieved Features

### Book Discovery

- Home page with recommended books.
- Trending books section.
- Infinite scrolling support for longer book lists.
- Search from the navigation bar.
- Search results page with pagination through scroll loading.

### Personalized Recommendations

- Users can like books.
- Liked book subjects are stored as a taste profile.
- The home page recommendation query updates based on liked subjects.
- If no likes exist yet, recommendations fall back to general fiction.

### Book Details

- Details page for each book.
- Displays title, author, cover image, description, publication information, subjects/genres, and excerpts when available.
- Long descriptions can be expanded or collapsed.
- Users can add or remove a book from their library directly from the details page.
- Users can like books from the details page.

### Book Preview

- Preview route for each book.
- Embedded Internet Archive reader appears when an archive identifier is available.
- Built-in flipbook preview is generated from book descriptions and excerpts.
- Fallback preview pages are shown when preview text is unavailable.

### Personal Library

- Books can be saved to a local browser library.
- Saved books are grouped by reading status:
  - Want to Read
  - Currently Reading
  - Finished
- Users can update reading status.
- Users can mark saved books as favorite reads.
- Users can remove books from the library.
- Library data persists in `localStorage`.

### Responsive UI

- Responsive layouts for mobile, tablet, and desktop screens.
- Loading skeletons for book lists and book details.
- Error and empty states for failed or missing data.
- Reusable components for cards, lists, navigation, search, loading, preview, and library items.

### Testing

The project uses Vitest with React Testing Library.

Current tests cover:

- `BookCard` rendering, routing links, and adding books to the library.
- `BookLikeButton` liked/unliked interactions.
- `BookList` empty, loading, error, and completed pagination states.
- `buildPreviewPages` and text chunking utilities.
- `localStorage` library, favorites, reading status, likes, and recommendation query behavior.

## Tech Stack

- React
- Vite
- React Router DOM
- Tailwind CSS
- React PageFlip
- Open Library API
- Browser `localStorage`
- Vitest
- React Testing Library
- Jest DOM matchers
- User Event Testing Library

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with recommendations and trending books |
| `/search?q=query` | Search results page |
| `/book/:id` | Book details page |
| `/book/:id/preview` | Book preview and flipbook page |
| `/library` | Saved personal library |
| `*` | Not found page |

Sample route setup from `src/App.jsx`:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search" element={<SearchResults />} />
  <Route path="/book/:id/preview" element={<BookPreview />} />
  <Route path="/book/:id" element={<BookDetails />} />
  <Route path="/library" element={<Library />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Project Structure

```text
BookVerse/
|-- public/
|-- src/
|   |-- app/
|   |   |-- components/
|   |   |   |-- BookCard.jsx
|   |   |   |-- BookForm.jsx
|   |   |   |-- BookLikeButton.jsx
|   |   |   |-- BookList.jsx
|   |   |   |-- BookshelfIcon.jsx
|   |   |   |-- ErrorBoundary.jsx
|   |   |   |-- FlipbookReader.jsx
|   |   |   |-- LibraryBookItem.jsx
|   |   |   |-- LoadingSpinner.jsx
|   |   |   |-- Navbar.jsx
|   |   |   `-- SearchBar.jsx
|   |   `-- pages/
|   |       |-- BookDetails.jsx
|   |       |-- BookPreview.jsx
|   |       |-- Home.jsx
|   |       |-- Library.jsx
|   |       |-- NotFound.jsx
|   |       `-- SearchResults.jsx
|   |-- assets/
|   |-- hooks/
|   |   `-- useInfiniteBooks.js
|   |-- services/
|   |   `-- bookApi.js
|   |-- tests/
|   |   |-- BookCard.test.jsx
|   |   |-- BookLikeButton.test.jsx
|   |   |-- BookList.test.jsx
|   |   |-- buildPreviewPages.test.js
|   |   |-- localStorage.test.js
|   |   `-- setup.js
|   |-- utils/
|   |   |-- buildPreviewPages.js
|   |   `-- localStorage.js
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
|-- vite.config.js
`-- README.md
```

## API Integration

BookVerse uses Open Library endpoints for book search, work details, authors, covers, and linked editions.

Main examples:

```text
https://openlibrary.org/search.json?q=fiction
https://openlibrary.org/works/:workId.json
https://covers.openlibrary.org/b/id/:coverId-L.jpg
```

The service layer in `src/services/bookApi.js` normalizes API responses into book objects used by the UI.

Sample search request:

```javascript
const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
const response = await fetch(url)
const data = await response.json()
```

Sample normalized book object used by the interface:

```javascript
{
  id: 'OL45804W',
  title: 'The Hobbit',
  author: 'J. R. R. Tolkien',
  image: 'https://covers.openlibrary.org/b/id/coverId-L.jpg',
  publishedYear: 1937,
  subjects: ['Fantasy', 'Adventure'],
}
```

## Local Storage

The app stores user data in the browser with two main keys:

- `bookverse-library` for saved books, reading status, and favorite reads.
- `bookverse-likes-taste` for liked books and subject scores used by recommendations.

This means the app works without user authentication, but saved data is local to the current browser.

Sample localStorage write:

```javascript
window.localStorage.setItem('bookverse-library', JSON.stringify(books))
```

Sample localStorage read:

```javascript
const savedBooks =
  JSON.parse(window.localStorage.getItem('bookverse-library')) || []
```

## CRUD Operations

BookVerse implements CRUD-style behavior through a combination of the Open Library API and browser `localStorage`.

| Operation | How It Is Implemented |
| --- | --- |
| Create | A user adds a book to their personal library. The app creates a new saved book record in `localStorage` using `addBookToLibrary()`. Liking a book also creates or updates a taste-profile entry with `toggleBookLike()`. |
| Read | The app reads book data from the Open Library API using `searchBooks()` and `getBookDetails()`. It also reads saved library data from `localStorage` using `getSavedLibrary()`, `isBookInLibrary()`, and `isBookLiked()`. |
| Update | A user can update a saved book's reading status with `updateBookStatus()`, mark or unmark it as a favorite with `toggleBookFavorite()`, and update recommendation preferences by liking or unliking books with `toggleBookLike()`. |
| Delete | A user can remove a book from the library with `removeBookFromLibrary()`. Unliking a book removes that liked entry from the taste profile and subtracts its subject scores. |

The CRUD logic is centralized in `src/utils/localStorage.js`, while the API read operations are handled in `src/services/bookApi.js`. This keeps user-owned data separate from external book data.

### CRUD Flow Examples

Adding a book to the library:

```javascript
addBookToLibrary({
  id: book.id,
  title: book.title,
  author: authorsLabel,
  image: primaryCover,
  subjects: book.subjects,
})
```

Checking whether a book already exists in the library:

```javascript
const inLibrary = isBookInLibrary(book.id)
```

Updating reading progress:

```javascript
updateBookStatus(book.id, 'Currently Reading')
```

Marking a book as a favorite read:

```javascript
toggleBookFavorite(book.id)
```

Removing a saved book:

```javascript
removeBookFromLibrary(book.id)
```

Liking a book for recommendations:

```javascript
toggleBookLike({
  id: book.id,
  subjects: book.subjects,
})
```

Reading the recommendation query:

```javascript
const query = getRecommendationSearchQuery()
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing

Run the full test suite:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

Open the Vitest UI:

```bash
npm run test:ui
```

Sample component test:

```jsx
test('renders book title and author', () => {
  render(
    <MemoryRouter>
      <BookCard
        id="1"
        title="Atomic Habits"
        author="James Clear"
        image="https://via.placeholder.com/300"
      />
    </MemoryRouter>
  )

  expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
  expect(screen.getByText('James Clear')).toBeInTheDocument()
})
```

Sample utility test:

```javascript
test('addBookToLibrary saves a new book with default reading metadata', () => {
  const nextLibrary = addBookToLibrary({ id: 'OL100W', title: 'Parable of the Sower' })

  expect(nextLibrary[0]).toMatchObject({
    id: 'OL100W',
    status: 'Want to Read',
    favorite: false,
  })
})
```

## Development Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once |
| `npm run test:ui` | Open Vitest UI |

## User Stories Completed

- As a reader, I can search for books so that I can discover new titles.
- As a reader, I can view detailed book information before deciding what to read.
- As a reader, I can preview book content through a flipbook or archive embed.
- As a reader, I can save books to my personal library.
- As a reader, I can categorize books by reading status.
- As a reader, I can favorite books I have saved.
- As a reader, I can remove books from my library.
- As a reader, I can like books so that recommendations become more relevant.

## Submission Notes

- Figma design: https://www.figma.com/design/kxwWfFaNJtaZlVW7105L9H/Books-Library--Community-?node-id=108-238&t=dsgqxjIZOXvdBpfL-1
- API used: Open Library API
- Storage used: Browser `localStorage`
- Testing framework: Vitest


## Acknowledgements

BookVerse uses publicly available data from Open Library and Internet Archive links provided through Open Library records.
