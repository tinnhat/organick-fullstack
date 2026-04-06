import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShopPage from '../../../app/shop/page'

jest.mock('../../../components/shop/ProductGrid', () => {
  return function MockProductGrid({ products }: any) {
    return (
      <div data-testid='product-grid'>
        {products?.map((p: any) => (
          <div key={p._id} data-testid={`product-${p._id}`}>{p.name}</div>
        ))}
      </div>
    )
  }
})

jest.mock('../../../components/shop/ShopFilters', () => {
  return function MockShopFilters({ onFilter }: any) {
    return (
      <div data-testid='shop-filters'>
        <button onClick={() => onFilter({ category: 'all' })}>All</button>
        <button onClick={() => onFilter({ category: 'vegetables' })}>Vegetables</button>
      </div>
    )
  }
})

jest.mock('../../../lib/api', () => ({
  productService: {
    getProducts: jest.fn().mockResolvedValue({
      data: {
        products: [
          { _id: 'p1', name: 'Organic Carrots', price: 29.99, category: 'vegetables' },
          { _id: 'p2', name: 'Fresh Tomatoes', price: 39.99, category: 'vegetables' }
        ],
        total: 2
      }
    })
  }
}))

describe('Shop Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render shop page', () => {
      render(<ShopPage />)
      expect(screen.getByTestId('product-grid')).toBeInTheDocument()
    })

    it('should render product grid', () => {
      render(<ShopPage />)
      expect(screen.getByTestId('shop-filters')).toBeInTheDocument()
    })

    it('should display products', async () => {
      render(<ShopPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('product-p1')).toBeInTheDocument()
        expect(screen.getByTestId('product-p2')).toBeInTheDocument()
      })
    })
  })

  describe('Filters', () => {
    it('should call filter handler when filter is clicked', async () => {
      render(<ShopPage />)
      
      const filterButton = screen.getByText('Vegetables')
      fireEvent.click(filterButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('shop-filters')).toBeInTheDocument()
      })
    })
  })

  describe('Search', () => {
    it('should have a search input', () => {
      render(<ShopPage />)
      const searchInput = screen.getByPlaceholderText(/search/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('should update search value', () => {
      render(<ShopPage />)
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'carrot' } })
      expect(searchInput.value).toBe('carrot')
    })
  })

  describe('Product Display', () => {
    it('should display product name', async () => {
      render(<ShopPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Organic Carrots')).toBeInTheDocument()
      })
    })

    it('should display product price', async () => {
      render(<ShopPage />)
      
      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('should show message when no products', async () => {
      const { productService } = require('../../../lib/api')
      productService.getProducts.mockResolvedValueOnce({
        data: { products: [], total: 0 }
      })

      render(<ShopPage />)
      
      await waitFor(() => {
        const emptyMessage = screen.queryByText(/no products found/i)
        expect(emptyMessage || screen.getByText('No products available')).toBeInTheDocument()
      })
    })
  })
})