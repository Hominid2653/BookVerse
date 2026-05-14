import {
  ReadingStatus,
  addBookToLibrary,
  getRecommendationSearchQuery,
  getSavedLibrary,
  hasTasteProfile,
  isBookInLibrary,
  isBookLiked,
  removeBookFromLibrary,
  toggleBookFavorite,
  toggleBookLike,
  updateBookStatus,
} from '../utils/localStorage'

beforeEach(() => {
  // These utilities persist data, so each test starts with a clean browser store.
  window.localStorage.clear()
})

test('addBookToLibrary saves a new book with default reading metadata', () => {
  const nextLibrary = addBookToLibrary({
    id: 'OL100W',
    title: 'Parable of the Sower',
    author: 'Octavia E. Butler',
  })

  // New library entries always start as "Want to Read" unless changed later.
  expect(nextLibrary).toEqual([
    expect.objectContaining({
      id: 'OL100W',
      status: ReadingStatus.WANT_TO_READ,
      favorite: false,
    }),
  ])
  expect(isBookInLibrary('OL100W')).toBe(true)
})

test('addBookToLibrary does not duplicate an existing book', () => {
  addBookToLibrary({ id: 'OL100W', title: 'Original' })
  const nextLibrary = addBookToLibrary({ id: 'OL100W', title: 'Duplicate' })

  // Re-adding the same id should return the existing saved book instead of duplicating it.
  expect(nextLibrary).toHaveLength(1)
  expect(nextLibrary[0].title).toBe('Original')
})

test('updates reading status, favorite state, and removal', () => {
  addBookToLibrary({ id: 'OL200W', title: 'The Fifth Season' })

  updateBookStatus('OL200W', ReadingStatus.CURRENTLY_READING)
  toggleBookFavorite('OL200W')

  // Status and favorite updates should modify the saved entry in place by id.
  expect(getSavedLibrary()[0]).toMatchObject({
    id: 'OL200W',
    status: ReadingStatus.CURRENTLY_READING,
    favorite: true,
  })

  removeBookFromLibrary('OL200W')
  expect(getSavedLibrary()).toEqual([])
})

test('toggleBookLike stores liked books and builds a ranked recommendation query', () => {
  toggleBookLike({
    id: 'book-a',
    subjects: ['Fantasy', 'Magic', 'Fantasy'],
  })
  toggleBookLike({
    id: 'book-b',
    subjects: ['Magic', 'Adventure'],
  })

  // Subject scores are ranked and converted into the Open Library search query.
  expect(isBookLiked('book-a')).toBe(true)
  expect(hasTasteProfile()).toBe(true)
  expect(getRecommendationSearchQuery()).toBe('magic OR fantasy OR adventure')

  // Unliking a book subtracts the topic scores that book contributed.
  toggleBookLike({ id: 'book-a' })

  expect(isBookLiked('book-a')).toBe(false)
  expect(getRecommendationSearchQuery()).toBe('magic OR adventure')
})
