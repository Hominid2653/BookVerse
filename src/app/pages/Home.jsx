import Navbar from '../components/Navbar'
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,74,74,0.18),_transparent_30%),linear-gradient(180deg,_#1f3b31_0%,_#153122_100%)] py-10 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,34,69,0.18)] backdrop-blur-xl">
          <Navbar />

          <main className="mt-10 space-y-16">
            <BookList title="Recommended For You" books={recommendedBooks} />
            <BookList title="Trending Now" books={trendingBooks} />
          </main>
        </div>
      </div>
    </div>
  )
}
