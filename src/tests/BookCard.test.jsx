import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BookCard from '../app/components/BookCard'
import { getSavedLibrary } from '../utils/localStorage'

beforeEach(() => {
  // Clearing the testing local storage.
  window.localStorage.clear()
})

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
//testing the link for special 
test('links to the encoded book details page', () => {
  render(
    <MemoryRouter>
      <BookCard
        id="works/OL 123"
        title="The Book Thief"
        author="Markus Zusak"
        image="https://via.placeholder.com/300"
      />
    </MemoryRouter>
  )

  // Book ids can contain slashes or spaces, so the link should safely encode them.
  expect(screen.getByRole('link')).toHaveAttribute('href', '/book/works%2FOL%20123')
})

test('adds a book to the saved library', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BookCard
        id="OL1W"
        title="Kindred"
        author="Octavia E. Butler"
        image="https://via.placeholder.com/300"
        subjects={['Science Fiction']}
      />
    </MemoryRouter>
  )

  await user.click(screen.getByRole('button', { name: /add to library/i }))

  // Clicking the card action should persist the book with the app's default metadata.
  expect(getSavedLibrary()).toEqual([
    expect.objectContaining({
      id: 'OL1W',
      title: 'Kindred',
      author: 'Octavia E. Butler',
      subjects: ['Science Fiction'],
      status: 'Want to Read',
      favorite: false,
    }),
  ])
})
