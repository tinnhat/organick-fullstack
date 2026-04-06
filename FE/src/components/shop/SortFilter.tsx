'use client'
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'

export type SortOption = 'newest' | 'price-low-high' | 'price-high-low' | 'popular'

interface SortFilterProps {
  value: SortOption
  onChange: (sort: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'popular', label: 'Popular' },
]

export default function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    // ============ FEATURE: shop-ui START ============
    <Box sx={{ mb: 3, minWidth: 200 }}>
      <FormControl fullWidth size='small'>
        <InputLabel id='sort-filter-label'>Sort By</InputLabel>
        <Select
          labelId='sort-filter-label'
          value={value}
          label='Sort By'
          onChange={(e) => onChange(e.target.value as SortOption)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
