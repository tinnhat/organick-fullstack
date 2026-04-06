'use client'
import { Box, TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface SearchFilterProps {
  value: string
  onChange: (search: string) => void
  onSubmit?: () => void
}

export default function SearchFilter({ value, onChange, onSubmit }: SearchFilterProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    // ============ FEATURE: shop-ui START ============
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        size='small'
        placeholder='Search products...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon sx={{ color: '#7eb693' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={handleClear}>
                <ClearIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
