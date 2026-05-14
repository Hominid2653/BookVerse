import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BookCard from '../app/components/BookCard'

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