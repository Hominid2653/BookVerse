import BookList from '../components/BookList'
import heroImg from '../../assets/hero.png'

const recommendedBooks = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    image: heroImg,
  },
  {
    id: 'the-power-of-habit',
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    image: heroImg,
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    image: heroImg,
  },
  {
    id: 'the-midnight-library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    image: heroImg,
  },
]

const trendingBooks = [
  {
    id: 'the-alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    image: heroImg,
  },
  {
    id: 'where-the-crawdads-sing',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    image: heroImg,
  },
  {
    id: 'becoming',
    title: 'Becoming',
    author: 'Michelle Obama',
    image: heroImg,
  },
  {
    id: 'the-nikola-tesla-story',
    title: 'Tesla: Inventor of the Modern',
    author: 'Richard Munson',
    image: heroImg,
  },
]

export default function Home() {
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
