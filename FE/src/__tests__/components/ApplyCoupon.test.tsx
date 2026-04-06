import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ApplyCoupon from '../../../components/coupon/ApplyCoupon'

global.fetch = jest.fn()

describe('ApplyCoupon Component', () => {
  const mockOnApply = jest.fn()
  const mockOnRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('Rendering', () => {
    it('should render coupon input field', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )
      expect(screen.getByPlaceholderText('Enter coupon code')).toBeInTheDocument()
    })

    it('should render validate button', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )
      expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument()
    })

    it('should render "Have a coupon?" text', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )
      expect(screen.getByText('Have a coupon?')).toBeInTheDocument()
    })
  })

  describe('Applied Coupon Display', () => {
    it('should display applied coupon when provided', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
          appliedCoupon={{
            code: 'SAVE10',
            type: 'percentage',
            value: 10,
            discount: 10
          }}
        />
      )
      expect(screen.getByText('Applied Coupon: SAVE10')).toBeInTheDocument()
    })

    it('should show percentage discount correctly', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
          appliedCoupon={{
            code: 'SAVE20',
            type: 'percentage',
            value: 20,
            discount: 20
          }}
        />
      )
      expect(screen.getByText(/20% off/)).toBeInTheDocument()
    })

    it('should show fixed discount correctly', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
          appliedCoupon={{
            code: 'FLAT15',
            type: 'fixed',
            value: 15,
            discount: 15
          }}
        />
      )
      expect(screen.getByText(/\$15\.00 off/)).toBeInTheDocument()
    })

    it('should call onRemove when remove button is clicked', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
          appliedCoupon={{
            code: 'SAVE10',
            type: 'percentage',
            value: 10,
            discount: 10
          }}
        />
      )
      
      fireEvent.click(screen.getByText('Remove'))
      expect(mockOnRemove).toHaveBeenCalled()
    })
  })

  describe('Validation', () => {
    it('should show error when code is empty and validate is clicked', async () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a coupon code')).toBeInTheDocument()
      })
    })

    it('should show error for invalid coupon', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid coupon' })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: 'INVALID' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Invalid coupon')).toBeInTheDocument()
      })
    })

    it('should show error for expired coupon', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            code: 'EXPIRED',
            isActive: true,
            expiresAt: '2020-01-01',
            type: 'percentage',
            value: 10
          }
        })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: 'EXPIRED' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        expect(screen.getByText('This coupon has expired')).toBeInTheDocument()
      })
    })

    it('should show error when order amount is below minimum', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            code: 'MIN100',
            isActive: true,
            expiresAt: '2030-01-01',
            type: 'percentage',
            value: 10,
            minOrder: 200
          }
        })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: 'MIN100' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Minimum order amount is $200')).toBeInTheDocument()
      })
    })
  })

  describe('Apply Coupon Flow', () => {
    it('should show validated coupon preview', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            code: 'SAVE10',
            isActive: true,
            expiresAt: '2030-01-01',
            type: 'percentage',
            value: 10
          }
        })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: 'SAVE10' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/10% off/)).toBeInTheDocument()
      })
    })

    it('should call onApply when apply button is clicked', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            code: 'SAVE10',
            isActive: true,
            expiresAt: '2030-01-01',
            type: 'percentage',
            value: 10
          }
        })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: 'SAVE10' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /apply coupon/i }))
      })
      
      expect(mockOnApply).toHaveBeenCalledWith(expect.objectContaining({
        code: 'SAVE10',
        type: 'percentage',
        value: 10
      }))
    })

    it('should clear input after successful apply', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            code: 'SAVE10',
            isActive: true,
            expiresAt: '2030-01-01',
            type: 'percentage',
            value: 10
          }
        })
      })

      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'SAVE10' } })
      
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /apply coupon/i }))
      })
      
      expect(input.value).toBe('')
    })
  })

  describe('Input Behavior', () => {
    it('should convert input to uppercase', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'save20' } })
      
      expect(input.value).toBe('SAVE20')
    })

    it('should clear validation error when typing', () => {
      render(
        <ApplyCoupon
          onApply={mockOnApply}
          onRemove={mockOnRemove}
          totalAmount={100}
        />
      )

      const input = screen.getByPlaceholderText('Enter coupon code')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(screen.getByRole('button', { name: /validate/i }))
      
      const validateButton = screen.getByRole('button', { name: /validate/i })
      fireEvent.change(input, { target: { value: 'S' } })
      
      expect(screen.queryByText('Please enter a coupon code')).not.toBeInTheDocument()
    })
  })
})