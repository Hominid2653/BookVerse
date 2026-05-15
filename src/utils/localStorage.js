// Local storage utilities for managing the user's library and likes/taste profile.
const LIBRARY_KEY = 'bookverse-library'
// 
export const ReadingStatus = {
  WANT_TO_READ: 'Want to Read',
  CURRENTLY_READING: 'Currently Reading',
  FINISHED: 'Finished',
}
// We store the user's saved library as an array of book objects with some additional metadata (status, favorite). 
// The "likes & taste" profile is stored separately and tracks which books the user has liked, along with topic scores for recommendations. 
// Both are persisted in localStorage and accessed via helper functions that handle JSON parsing/stringifying and provide a simple API for the rest of the app.
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
// Library Management to get saved books etc
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

  const nextLibrary = [
    ...library,
    { ...book, status: ReadingStatus.WANT_TO_READ, favorite: Boolean(book.favorite) },
  ]
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

export function toggleBookFavorite(bookId) {
  const library = readLocalStorage()
  const nextLibrary = library.map((item) =>
    item.id === bookId ? { ...item, favorite: !item.favorite } : item,
  )
  writeLocalStorage(nextLibrary)
  return nextLibrary
}

export function isFavoriteRead(bookId) {
  const library = readLocalStorage()
  const entry = library.find((item) => item.id === bookId)
  return Boolean(entry?.favorite)
}

export function isBookInLibrary(bookId) {
  const library = readLocalStorage()
  return library.some((item) => item.id === bookId)
}

export function clearLibrary() {
  writeLocalStorage([])
}

//Recommendations algorithm

const LIKES_TASTE_KEY = 'bookverse-likes-taste'
const RECOMMENDATION_TERM_LIMIT = 3
const IGNORED_RECOMMENDATION_TOPICS = new Set([
  'accessible book',
  'protected daisy',
  'in library',
  'overdrive',
  'internet archive',
  'juvenile literature',
  'literature',
  'open library staff picks',
])

const likeListeners = new Set()
let storageListenerBound = false

function notifyLikesTaste() {
  likeListeners.forEach((cb) => {
    try {
      cb()
    } catch {
      /* ignore listener errors */
    }
  })
}

export function subscribeLikesTaste(callback) {
  if (typeof window !== 'undefined' && !storageListenerBound) {
    window.addEventListener('storage', (event) => {
      if (event.key === LIKES_TASTE_KEY) notifyLikesTaste()
    })
    storageListenerBound = true
  }
  likeListeners.add(callback)
  return () => likeListeners.delete(callback)
}

function readLikesTaste() {
  if (typeof window === 'undefined') {
    return { entries: [], topicScores: {} }
  }
  try {
    const raw = window.localStorage.getItem(LIKES_TASTE_KEY)
    if (!raw) return { entries: [], topicScores: {} }
    const parsed = JSON.parse(raw)
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      topicScores:
        parsed.topicScores && typeof parsed.topicScores === 'object'
          ? parsed.topicScores
          : {},
    }
  } catch {
    return { entries: [], topicScores: {} }
  }
}

function writeLikesTaste(data) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LIKES_TASTE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Unable to save likes / taste profile', error)
  }
}

function normalizeTopicKey(topic) {
  return String(topic).trim().toLowerCase()
}

function isUsefulRecommendationTopic(topic) {
  const key = normalizeTopicKey(topic)
  if (!key) return false
  if (IGNORED_RECOMMENDATION_TOPICS.has(key)) return false
  if (/^\d+$/.test(key)) return false
  return true
}

function getRankedRecommendationTopics() {
  const { topicScores } = readLikesTaste()
  const ranked = Object.entries(topicScores)
    .filter(([topic, score]) => score > 0 && isUsefulRecommendationTopic(topic))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  if (ranked.length > 0) return ranked.map(([topic]) => topic)

  return Object.entries(topicScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([topic]) => topic)
}

export function hasTasteProfile() {
  const { topicScores } = readLikesTaste()
  return Object.values(topicScores).some((score) => score > 0)
}

export function getRecommendationSearchQuery() {
  const top = getRankedRecommendationTopics().slice(0, RECOMMENDATION_TERM_LIMIT)
  return top.length ? top.join('|') : 'fiction'
}

export function getRecommendationSearchTerms() {
  return getRecommendationSearchQuery().split('|').filter(Boolean)
}

export function isBookLiked(bookId) {
  if (!bookId) return false
  const { entries } = readLikesTaste()
  return entries.some((entry) => entry.id === bookId)
}

/**
 * Like / unlike a book. Liked topics (from `subjects`) accumulate and steer the home recommendation query.
 * @param {{ id: string, subjects?: string[] }} book
 */
export function toggleBookLike(book) {
  const id = book?.id
  if (!id) return readLikesTaste()

  const rawSubjects = Array.isArray(book.subjects) ? book.subjects : []
  const preferredTopicKeys = Array.from(
    new Set(rawSubjects.map(normalizeTopicKey).filter(isUsefulRecommendationTopic)),
  )
  const fallbackTopicKeys = Array.from(
    new Set(rawSubjects.map(normalizeTopicKey).filter(Boolean)),
  )
  const topicKeys = (preferredTopicKeys.length ? preferredTopicKeys : fallbackTopicKeys).slice(0, 8)

  const data = readLikesTaste()
  const idx = data.entries.findIndex((entry) => entry.id === id)

  if (idx >= 0) {
    const removed = data.entries[idx]
    const keys = Array.isArray(removed.topicKeys) ? removed.topicKeys : []
    data.entries = data.entries.filter((_, i) => i !== idx)
    for (const key of keys) {
      if (!data.topicScores[key]) continue
      data.topicScores[key] -= 1
      if (data.topicScores[key] <= 0) delete data.topicScores[key]
    }
  } else {
    data.entries.push({ id, topicKeys })
    for (const key of topicKeys) {
      data.topicScores[key] = (data.topicScores[key] || 0) + 1
    }
  }

  writeLikesTaste(data)
  notifyLikesTaste()
  return data
}
