'use client'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Skeleton,
  Alert,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { DotLoader } from 'react-spinners'
import { toast } from 'sonner'
import { useGetAllProductsQuery } from '@/app/utils/hooks/productsHooks'
import { FilterSidebar } from '@/components/shop'
import { ProductCardNew } from '@/components/product'
import { SortOption } from '@/components/shop/SortFilter'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import './style.scss'

interface FilterState {
  categories: string[]
  minPrice: number
  maxPrice: number
  sort: SortOption
  search: string
}

const initialFilters: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 1000,
  sort: 'newest',
  search: '',
}

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [pageNumber, setPageNumber] = useState(0)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { data: allProducts, isLoading, isError } = useGetAllProductsQuery()
  const router = useRouter()

  const productPerPage = 12
  const pagesVisited = pageNumber * productPerPage

  useEffect(() => {
    if (!allProducts) return

    let result = [...allProducts]

    if (filters.categories.length > 0) {
      result = result.filter((product: Product) =>
        product.category?.some(cat => filters.categories.includes(cat._id))
      )
    }

    if (filters.minPrice > 0 || filters.maxPrice < 1000) {
      result = result.filter((product: Product) => {
        const price = product.priceSale && product.priceSale > 0 ? product.priceSale : product.price
        return price >= filters.minPrice && price <= filters.maxPrice
      })
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((product: Product) =>
        product.name.toLowerCase().includes(searchLower)
      )
    }

    switch (filters.sort) {
      case 'price-low-high':
        result.sort((a: Product, b: Product) => {
          const priceA = a.priceSale && a.priceSale > 0 ? a.priceSale : a.price
          const priceB = b.priceSale && b.priceSale > 0 ? b.priceSale : b.price
          return priceA - priceB
        })
        break
      case 'price-high-low':
        result.sort((a: Product, b: Product) => {
          const priceA = a.priceSale && a.priceSale > 0 ? a.priceSale : a.price
          const priceB = b.priceSale && b.priceSale > 0 ? b.priceSale : b.price
          return priceB - priceA
        })
        break
      case 'popular':
        result.sort((a: Product, b: Product) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case 'newest':
      default:
        result.sort((a: Product, b: Product) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        break
    }

    setFilteredProducts(result)
    setPageNumber(0)
  }, [allProducts, filters])

  const handleSearch = useCallback(() => {
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 500)
  }, [])

  const handleClearAll = useCallback(() => {
    setFilters(initialFilters)
    setPageNumber(0)
  }, [])

  const handlePageChange = ({ selected }: { selected: number }) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setPageNumber(selected)
  }

  const displayProducts = filteredProducts.slice(pagesVisited, pagesVisited + productPerPage)
  const pageCount = Math.ceil(filteredProducts.length / productPerPage)

  return (
    // ============ FEATURE: shop-ui START ============
    <Box className='shop-page-new'>
      <Box className='shop-hero'>
        <Box className='shop-hero-overlay'>
          <Image
            src='/assets/img/shop-page.webp'
            alt='Shop Banner'
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Container maxWidth='lg'>
          <Box className='shop-hero-content'>
            <Typography variant='h1' className='shop-hero-title'>
              Shop
            </Typography>
            <Typography variant='body1' className='shop-hero-subtitle'>
              Discover the best organic products for your healthy lifestyle
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth='lg'>
        <Box className='shop-content'>
          <Box className='shop-header'>
            <Box className='shop-results'>
              <Typography variant='body2' color='text.secondary'>
                Showing {pagesVisited + 1}-{Math.min(pagesVisited + productPerPage, filteredProducts.length)} of{' '}
                {filteredProducts.length} products
              </Typography>
            </Box>
            <Box className='shop-sort-mobile'>
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onSearch={handleSearch}
                onClearAll={handleClearAll}
              />
            </Box>
          </Box>

          <Grid container spacing={4} className='shop-main'>
            <Grid item md={3} className='shop-sidebar-desktop'>
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onSearch={handleSearch}
                onClearAll={handleClearAll}
              />
            </Grid>

            <Grid item xs={12} md={9} className='shop-products'>
              {isLoading || isSearching ? (
                <Box className='shop-loading'>
                  <DotLoader size={50} color='#274c5b' />
                </Box>
              ) : isError ? (
                <Alert severity='error' sx={{ m: 2 }}>
                  Failed to load products. Please try again later.
                </Alert>
              ) : filteredProducts.length === 0 ? (
                <Box className='shop-empty'>
                  <ShoppingBagIcon sx={{ fontSize: 64, color: '#d4d4d4', mb: 2 }} />
                  <Typography variant='h6' color='text.secondary'>
                    No products found
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Try adjusting your filters or search terms
                  </Typography>
                  <Button
                    variant='contained'
                    onClick={handleClearAll}
                    sx={{ bgcolor: '#7eb693', '&:hover': { bgcolor: '#6aa583' } }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              ) : (
                <>
                  <Grid container spacing={3} className='products-grid'>
                    {displayProducts.map((product: Product) => (
                      <Grid item xs={12} sm={6} lg={4} key={product._id}>
                        <ProductCardNew product={product} />
                      </Grid>
                    ))}
                  </Grid>

                  {pageCount > 1 && (
                    <Box className='shop-pagination'>
                      <ReactPaginate
                        activeClassName={'page-btn active'}
                        breakClassName={'page-btn break-me'}
                        breakLabel={'...'}
                        containerClassName={'pagination'}
                        nextLabel={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            Next <ArrowForwardIcon fontSize='small' />
                          </Box>
                        }
                        disabledClassName={'disabled-page'}
                        nextClassName={'page-btn next'}
                        pageClassName={'page-btn pagination-page'}
                        previousClassName={'page-btn previous'}
                        previousLabel={'Prev'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        initialPage={0}
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
