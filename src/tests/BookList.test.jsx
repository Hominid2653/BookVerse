import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BookList from '../app/components/BookList'

beforeEach(() => {
  window.localStorage.clear()
})

test('renders an empty message when there are no books', () => {
  render(
    <MemoryRouter>
      <BookList books={[]} />
    </MemoryRouter>
  )

  expect(screen.getByText('No books found.')).toBeInTheDocument()
})

test('renders loading skeletons for the initial loading state', () => {
  render(
    <MemoryRouter>
      <BookList books={[]} loadingInitial initialSkeletonCount={3} />
    </MemoryRouter>
  )

  // The loading UI should replace the empty-state message while data is being fetched.
  expect(screen.getByRole('status', { name: /loading books/i })).toBeInTheDocument()
  expect(screen.queryByText('No books found.')).not.toBeInTheDocument()
})

test('renders an error message', () => {
  render(
    <MemoryRouter>
      <BookList books={[]} error={new Error('Could not load books')} />
    </MemoryRouter>
  )

  expect(screen.getByRole('alert')).toHaveTextContent('Could not load books')
})

test('renders books and the caught-up message when pagination is finished', () => {
  render(
    <MemoryRouter>
      <BookList
        title="Recommended"
        books={[
          {
            id: 'OL1W',
            title: 'Akata Witch',
            author: 'Nnedi Okorafor',
            image: 'https://example.com/akata.jpg',
          },
        ]}
        hasMore={false}
        onLoadMore={() => {}}
      />
    </MemoryRouter>
  )

  // When infinite scrolling has no more data, the user gets a clear end-of-list message.
  expect(screen.getByRole('heading', { name: 'Recommended' })).toBeInTheDocument()
  expect(screen.getByText('Akata Witch')).toBeInTheDocument()
  expect(screen.getByText("You're all caught up.")).toBeInTheDocument()
})
