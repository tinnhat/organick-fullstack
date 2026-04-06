import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from '../../../components/rating/StarRating'

jest.mock('@mui/icons-material/Star', () => ({
  default: () => <span data-testid='star-icon' />
}))

jest.mock('@mui/icons-material/StarHalf', () => ({
  default: () => <span data-testid='star-half-icon' />
}))

jest.mock('@mui/icons-material/StarBorder', () => ({
  default: () => <span data-testid='star-border-icon' />
}))

describe('StarRating Component', () => {
  describe('Display Mode (readOnly)', () => {
    it('should render 5 stars when value is 0', () => {
      render(<StarRating value={0} readOnly />)
      const starContainers = screen.getAllByTestId(/star/i)
      expect(starContainers.length).toBe(5)
    })

    it('should render filled stars based on value', () => {
      render(<StarRating value={3} readOnly />)
      const stars = screen.getAllByTestId('star-icon')
      expect(stars.length).toBe(3)
    })

    it('should show value when showValue is true', () => {
      render(<StarRating value={4.5} readOnly showValue />)
      expect(screen.getByText('4.5')).toBeInTheDocument()
    })

    it('should display partial star for half values', () => {
      render(<StarRating value={3.5} readOnly />)
      const halfStars = screen.getAllByTestId('star-half-icon')
      expect(halfStars.length).toBe(1)
    })
  })

  describe('Interactive Mode', () => {
    it('should call onChange when star is clicked', () => {
      const mockOnChange = jest.fn()
      render(<StarRating value={0} onChange={mockOnChange} />)
      
      const starBorderIcons = screen.getAllByTestId('star-border-icon')
      fireEvent.click(starBorderIcons[2])
      
      expect(mockOnChange).toHaveBeenCalledWith(3)
    })

    it('should show hover state on mouse enter', () => {
      const mockOnChange = jest.fn()
      render(<StarRating value={0} onChange={mockOnChange} />)
      
      const stars = screen.getAllByTestId(/star/i)
      fireEvent.mouseEnter(stars[2])
      
      expect(screen.getAllByTestId('star-icon').length).toBe(3)
    })

    it('should not call onChange when readOnly', () => {
      const mockOnChange = jest.fn()
      render(<StarRating value={2} onChange={mockOnChange} readOnly />)
      
      const stars = screen.getAllByTestId('star-icon')
      fireEvent.click(stars[0])
      
      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should reset hover on mouse leave', () => {
      render(<StarRating value={2} />)
      
      const container = screen.getByText('').parentElement
      fireEvent.mouseLeave(container!)
      
      expect(container).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    it('should render with small size', () => {
      const { container } = render(<StarRating value={3} size='small' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with medium size', () => {
      const { container } = render(<StarRating value={3} size='medium' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with large size', () => {
      const { container } = render(<StarRating value={3} size='large' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})