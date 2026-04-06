'use client'
import { Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, SelectChangeEvent } from '@mui/material'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import { useTheme } from '@mui/material/styles'

interface CategoryFilterProps {
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

export default function CategoryFilter({ selectedCategories, onChange }: CategoryFilterProps) {
  const { data: categories } = useGetCategoriesQuery()
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const value = event.target.value
    onChange(typeof value === 'string' ? value.split(',') : value)
  }

  const categoryOptions = categories
    ?.filter((item: any) => !item._destroy)
    .map((item: Category) => ({ value: item._id, label: item.name })) || []

  return (
    // ============ FEATURE: shop-ui START ============
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth size='small'>
        <InputLabel id='category-filter-label'>Categories</InputLabel>
        <Select
          labelId='category-filter-label'
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput label='Categories' />}
          renderValue={(selected) =>
            selected
              .map((id) => categoryOptions.find((opt: any) => opt.value === id)?.label)
              .filter(Boolean)
              .join(', ')
          }
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
        >
          {categoryOptions.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCategories.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          {selectedCategories.map((catId) => {
            const cat = categoryOptions.find((opt: any) => opt.value === catId)
            return cat ? (
              <Chip
                key={catId}
                label={cat.label}
                size='small'
                onDelete={() => onChange(selectedCategories.filter((id) => id !== catId))}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiChip-deleteIcon': { color: 'white' },
                }}
              />
            ) : null
          })}
        </Box>
      )}
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
