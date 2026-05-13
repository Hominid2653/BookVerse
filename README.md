# 📚 BookVerse

BookVerse is a modern React web application that allows users to **discover, preview, and manage books in a personal digital library**. The application integrates with external book APIs to fetch real book data and provides an intuitive reading experience through a clean, responsive interface.

Users can search for books, explore detailed information, preview pages using an embedded reader, and organize books into a personalized library.

---

# 🚀 Project Overview

Many readers struggle to find a **simple platform to discover books and track their reading progress** without needing to create accounts or use complex systems.

BookVerse solves this problem by providing:

- A lightweight book discovery platform
- A personal reading tracker
- An embedded preview reader for exploring books before committing to read them

The project focuses on **clean UI/UX, modular component architecture, and integration with external APIs**.

---

# 🧩 Problem Statement

Readers often rely on multiple platforms to discover books, preview content, and track reading progress. These fragmented systems make it difficult to manage personal reading journeys efficiently.

BookVerse provides a **single platform where users can search books, preview content, and manage a reading library without requiring authentication or complex setup**.

---

# 👥 User Stories

- As a reader, I want to **search for books** so that I can discover new titles.
- As a reader, I want to **view detailed book information** so that I can decide whether the book interests me.
- As a reader, I want to **preview some pages of a book** before reading it fully.
- As a reader, I want to **save books to my personal library** for future reference.
- As a reader, I want to **categorize books into reading stages** (Want to Read, Currently Reading, Finished).
- As a reader, I want to **remove books from my library** if I lose interest.

---

# 🛠 Tech Stack

### Frontend
- React.js (Functional Components + Hooks)

### Styling
- Tailwind CSS

### State Management
- React `useState`
- React `useEffect`

### Routing
- React Router DOM

### Data Source
External APIs such as:

- Open Library API
- Google Books API

### Storage
- Browser LocalStorage (for saved books)

### Deployment
- Vercel or Netlify

---

# ⚙️ Core Features

## 🔍 Book Search
Users can search for books using an external API.

## 📖 Book Details
Detailed book information is displayed including:
- Title
- Author
- Description
- Publication year
- Genres

## 📚 Personal Library
Users can save books into a personal reading list.

Library categories include:
- Want to Read
- Currently Reading
- Finished Reading

## 📑 Book Preview
Selected books can be previewed using an embedded flipbook reader.

## 🧹 Library Management
Users can:
- Update reading status
- Remove books from their library

## 📱 Responsive UI
The interface adapts to desktop, tablet, and mobile devices.

---

# 🧱 Project Architecture

The application follows a **modular component structure** to ensure maintainability and scalability.

Core components include:

- Navbar / Sidebar
- Home Dashboard
- Search Results
- Book Card Component
- Book Details Page
- Library Page
- Reader Preview Component

---

# 📂 Project Folder Structure

```
bookverse/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BookCard.jsx
│   │   ├── BookList.jsx
│   │   ├── SearchBar.jsx
│   │   └── FlipbookReader.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SearchResults.jsx
│   │   ├── BookDetails.jsx
│   │   └── Library.jsx
│   │
│   ├── services/
│   │   └── bookApi.js
│   │
│   ├── utils/
│   │   └── localStorage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── README.md
└── tailwind.config.js
```

---

# 🗺 Application Routes

| Route | Description |
|------|-------------|
| `/` | Home page showing featured or trending books |
| `/search` | Displays search results |
| `/book/:id` | Displays detailed information about a book |
| `/library` | Displays user's saved books |

---

# 📡 API Integration

The application fetches book data from external APIs.

Example endpoint:

```
https://openlibrary.org/search.json?q=harry+potter
```

Example fetch:

```javascript
fetch(`https://openlibrary.org/search.json?q=${query}`)
  .then(res => res.json())
  .then(data => setBooks(data.docs))
```

---

# 💾 Local Storage Example

Saved books are stored in the browser using `localStorage`.

Example:

```javascript
localStorage.setItem("library", JSON.stringify(savedBooks))
```

Retrieve saved books:

```javascript
const library = JSON.parse(localStorage.getItem("library")) || []
```

---

# 🧪 API Testing

Endpoints can be tested using **Postman** before frontend integration.

Tested operations include:

- GET requests for book search
- Handling empty responses
- Handling API errors

---

# 🔧 Development Workflow

## Phase 1 — UI/UX Design
High fidelity designs created in **Figma**.

Focus areas:
- Book browsing experience
- Reader preview interface
- Library organization

## Phase 2 — Project Management

Kanban board used to track progress.

Columns include:

- To Do
- In Progress
- Done

Weekly sprints used to implement features.

## Phase 3 — Development

Development process:

1. Setup React project
2. Configure routing
3. Integrate external book API
4. Implement UI components
5. Implement library management with localStorage
6. Add reader preview feature

---

# 🔀 GitHub Best Practices

### Branching Strategy

Main branch is protected.

Feature branches include:

```
feature/book-search
feature/library-page
feature/reader-preview
feature/ui-components
```

### Pull Requests

All features are merged using pull requests.

### Commit Message Style

Examples:

```
feat: implement book search functionality
feat: add personal library feature
fix: resolve API fetch error
style: update UI layout
```

---

# 🚀 Deployment

The application can be deployed using:

### Vercel
or

### Netlify

Deployment process:

1. Push project to GitHub
2. Connect repository to deployment platform
3. Automatic builds triggered on commits

---

# 📋 Submission Checklist

- [ ] Figma Design Link
- [ ] Trello/Jira Board Screenshot
- [ ] GitHub Repository
- [ ] Live Deployment Link
- [ ] External API Documentation

---

# 🙌 Acknowledgements

BookVerse uses publicly available data from open book APIs to provide book discovery and preview functionality.