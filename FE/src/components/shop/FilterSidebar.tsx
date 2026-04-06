'use client'
import { Box, Drawer, useMediaQuery, useTheme, Button, IconButton, Typography, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import CategoryFilter from './CategoryFilter'
import PriceRangeFilter from './PriceRangeFilter'
import SortFilter, { SortOption } from './SortFilter'
import SearchFilter from './SearchFilter'
import { useState } from 'react'

interface FilterState {
  categories: string[]
  minPrice: number
  maxPrice: number
  sort: SortOption
  search: string
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onSearch: () => void
  onClearAll: () => void
}

export default function FilterSidebar({ filters, onFilterChange, onSearch, onClearAll }: FilterSidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleOpenDrawer = () => setDrawerOpen(true)
  const handleCloseDrawer = () => setDrawerOpen(false)

  const handleClearAll = () => {
    onClearAll()
    handleCloseDrawer()
  }

  const filterContent = (
    <Box sx={{ p: { xs: 2, md: 3 }, width: { md: 280 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600, color: '#274c5b' }}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={handleCloseDrawer} size='small'>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <SearchFilter
        value={filters.search}
        onChange={(search) => onFilterChange({ ...filters, search })}
        onSubmit={onSearch}
      />

      <Divider sx={{ my: 2 }} />

      <CategoryFilter
        selectedCategories={filters.categories}
        onChange={(categories) => onFilterChange({ ...filters, categories })}
      />

      <Divider sx={{ my: 2 }} />

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={(minPrice, maxPrice) => onFilterChange({ ...filters, minPrice, maxPrice })}
      />

      <Divider sx={{ my: 2 }} />

      <SortFilter
        value={filters.sort}
        onChange={(sort) => onFilterChange({ ...filters, sort })}
      />

      <Button
        variant='outlined'
        fullWidth
        onClick={handleClearAll}
        sx={{
          mt: 3,
          color: '#274c5b',
          borderColor: '#274c5b',
          '&:hover': { borderColor: '#7eb693', backgroundColor: 'rgba(126, 182, 147, 0.1)' },
        }}
      >
        Clear All Filters
      </Button>
    </Box>
  )

  return (
    // ============ FEATURE: shop-ui START ============
    <>
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button
          variant='contained'
          startIcon={<FilterListIcon />}
          onClick={handleOpenDrawer}
          sx={{ bgcolor: '#7eb693', '&:hover': { bgcolor: '#6aa583' } }}
        >
          Filters
        </Button>
      </Box>

      {isMobile ? (
        <Drawer
          anchor='right'
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{ sx: { width: 300 } }}
        >
          {filterContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {filterContent}
        </Box>
      )}
    </>
    // ============ FEATURE: shop-ui END ============
  )
}
