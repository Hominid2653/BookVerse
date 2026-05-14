import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookLikeButton from '../app/components/BookLikeButton'
import { isBookLiked } from '../utils/localStorage'

beforeEach(() => {
  // Likes are stored in localStorage, so reset it before each test.
  window.localStorage.clear()
})

test('toggles between liked and unliked states', async () => {
  const user = userEvent.setup()

  render(
    <BookLikeButton
      book={{
        id: 'OL55W',
        title: 'The Left Hand of Darkness',
        author: 'Ursula K. Le Guin',
        subjects: ['Science Fiction'],
      }}
    />
  )

  const button = screen.getByRole('button', { name: /like to tune recommendations/i })
  expect(button).toHaveAttribute('aria-pressed', 'false')

  // First click likes the book and updates both the label and pressed state.
  await user.click(button)

  expect(screen.getByRole('button', { name: /unlike and update recommendations/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(isBookLiked('OL55W')).toBe(true)

  // Clicking again removes the book from the taste profile.
  await user.click(screen.getByRole('button', { name: /unlike and update recommendations/i }))

  expect(isBookLiked('OL55W')).toBe(false)
})
