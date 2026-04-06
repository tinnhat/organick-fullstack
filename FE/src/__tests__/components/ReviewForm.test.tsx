import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReviewForm from '../../../components/review/ReviewForm'
import StarRating from '../../../components/rating/StarRating'

jest.mock('../../../components/rating/StarRating', () => {
  return function MockStarRating(props: any) {
    return (
      <div data-testid='star-rating-mock' onClick={() => props.onChange && props.onChange(5)}>
        Star Rating Component
      </div>
    )
  }
})

describe('ReviewForm Component', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render form with correct title for new review', () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )
      expect(screen.getByText('Write a Review')).toBeInTheDocument()
    })

    it('should render form with correct title for editing review', () => {
      render(
        <ReviewForm
          productId='product123'
          existingReview={{ _id: 'review123', rating: 4, comment: 'Good product' }}
          onSubmit={mockOnSubmit}
        />
      )
      expect(screen.getByText('Edit Your Review')).toBeInTheDocument()
    })

    it('should render StarRating component', () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )
      expect(screen.getByTestId('star-rating-mock')).toBeInTheDocument()
    })

    it('should render comment TextField', () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render Submit button', () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should show error when rating is 0 on submit', async () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please select a rating')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error when comment is less than 10 characters', async () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'Short' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Comment must be at least 10 characters')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Submit Functionality', () => {
    it('should call onSubmit with correct data', async () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'This is a great product that I really enjoyed using!' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          rating: 5,
          comment: 'This is a great product that I really enjoyed using!'
        })
      })
    })

    it('should show loading state during submission', async () => {
      const slowSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      render(
        <ReviewForm
          productId='product123'
          onSubmit={slowSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'This is a great product that I really enjoyed using!' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
    })

    it('should show error message on submission failure', async () => {
      const failedSubmit = jest.fn().mockRejectedValue(new Error('Network error'))
      render(
        <ReviewForm
          productId='product123'
          onSubmit={failedSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'This is a great product that I really enjoyed using!' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('Cancel Button', () => {
    it('should render cancel button when onCancel is provided', () => {
      const mockOnCancel = jest.fn()
      render(
        <ReviewForm
          productId='product123'
          existingReview={{ _id: 'review123', rating: 4, comment: 'Good' }}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should call onCancel when cancel button is clicked', () => {
      const mockOnCancel = jest.fn()
      render(
        <ReviewForm
          productId='product123'
          existingReview={{ _id: 'review123', rating: 4, comment: 'Good' }}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should not render cancel button when onCancel is not provided', () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('should show success message after submission', async () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'This is a great product that I really enjoyed using!' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Review submitted successfully!')).toBeInTheDocument()
      })
    })

    it('should clear form after successful submission for new review', async () => {
      render(
        <ReviewForm
          productId='product123'
          onSubmit={mockOnSubmit}
        />
      )

      const starRating = screen.getByTestId('star-rating-mock')
      fireEvent.click(starRating)

      const commentField = screen.getByRole('textbox')
      fireEvent.change(commentField, { target: { value: 'This is a great product that I really enjoyed using!' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(commentField).toHaveValue('')
      })
    })
  })
})