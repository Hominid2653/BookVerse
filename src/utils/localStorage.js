const LIBRARY_KEY = 'bookverse-library'

export const ReadingStatus = {
  WANT_TO_READ: 'Want to Read',
  CURRENTLY_READING: 'Currently Reading',
  FINISHED: 'Finished',
}

function readLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(LIBRARY_KEY)
    return storedValue ? JSON.parse(storedValue) : []
  } catch (error) {
    console.error('Unable to read saved library from localStorage', error)
    return []
  }
}

function writeLocalStorage(value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(value))
  } catch (error) {
    console.error('Unable to save library to localStorage', error)
  }
}

export function getSavedLibrary() {
  return readLocalStorage()
}

export function saveLibrary(books) {
  writeLocalStorage(books)
}

export function addBookToLibrary(book) {
  const library = readLocalStorage()
  const exists = library.some((item) => item.id === book.id)

  if (exists) {
    return library
  }

  const nextLibrary = [...library, { ...book, status: ReadingStatus.WANT_TO_READ }]
  writeLocalStorage(nextLibrary)
  return nextLibrary
}

export function removeBookFromLibrary(bookId) {
  const library = readLocalStorage()
  const nextLibrary = library.filter((item) => item.id !== bookId)
  writeLocalStorage(nextLibrary)
  return nextLibrary
}

export function updateBookStatus(bookId, status) {
  const library = readLocalStorage()
  const nextLibrary = library.map((item) =>
    item.id === bookId ? { ...item, status } : item,
  )
  writeLocalStorage(nextLibrary)
  return nextLibrary
}

export function isBookInLibrary(bookId) {
  const library = readLocalStorage()
  return library.some((item) => item.id === bookId)
}

export function clearLibrary() {
  writeLocalStorage([])
}
