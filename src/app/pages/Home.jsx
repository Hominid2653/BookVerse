<<<<<<< HEAD
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
=======
>>>>>>> development
import BookList from '../components/BookList'
import { searchBooks } from '../../services/bookApi'

export default function Home() {
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [trendingBooks, setTrendingBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Fetch some popular books for recommendations
        const recBooks = await searchBooks('fiction', 8)
        setRecommendedBooks(recBooks.slice(0, 4))

        // Fetch trending books (using a different query)
        const trendBooks = await searchBooks('bestseller', 8)
        setTrendingBooks(trendBooks.slice(0, 4))
      } catch (error) {
        console.error('Failed to load books:', error)
        // Fallback to empty arrays
        setRecommendedBooks([])
        setTrendingBooks([])
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-none bg-white/95 backdrop-blur-xl">
      <main className="px-6 pb-10 pt-8 space-y-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Home</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Discover your next favorite book
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Explore carefully selected reads from your personal library, tailored recommendations, and trending stories.
          </p>
        </div>

        <BookList title="Recommended For You" books={recommendedBooks} />
        <BookList title="Trending Now" books={trendingBooks} />
      </main>
    </div>
  )
}
  


