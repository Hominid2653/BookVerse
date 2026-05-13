import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './app/pages/Home'
import SearchResults from './app/pages/SearchResults'
import BookDetails from './app/pages/BookDetails'
import Library from './app/pages/Library'
import NotFound from './app/pages/NotFound'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
