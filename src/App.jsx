import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './app/components/Navbar'
import Home from './app/pages/Home'
import About from './app/pages/About'
import SearchResults from './app/pages/SearchResults'
import BookDetails from './app/pages/BookDetails'
import BookPreview from './app/pages/BookPreview'
import Library from './app/pages/Library'
import NotFound from './app/pages/NotFound'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,55,96,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,55,96,0.14),_transparent_30%),#f8fbff]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/book/:id/preview" element={<BookPreview />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/library" element={<Library />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
