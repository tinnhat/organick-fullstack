'use client'
import { Box, TextField, Slider, Typography } from '@mui/material'
import { useState, useEffect } from 'react'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  onChange: (min: number, max: number) => void
}

export default function PriceRangeFilter({ minPrice, maxPrice, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  useEffect(() => {
    setLocalMin(minPrice)
    setLocalMax(maxPrice)
  }, [minPrice, maxPrice])

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setLocalMin(newValue[0])
      setLocalMax(newValue[1])
    }
  }

  const handleSliderChangeCommitted = () => {
    onChange(localMin, localMax)
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setLocalMin(value)
    if (value <= localMax) {
      onChange(value, localMax)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setLocalMax(value)
    if (value >= localMin) {
      onChange(localMin, value)
    }
  }

  return (
    // ============ FEATURE: shop-ui START ============
    <Box sx={{ mb: 3 }}>
      <Typography variant='subtitle2' sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={[localMin, localMax]}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay='auto'
          min={0}
          max={1000}
          sx={{ color: '#7eb693' }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label='Min'
          type='number'
          size='small'
          value={localMin}
          onChange={handleMinChange}
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />
        <TextField
          label='Max'
          type='number'
          size='small'
          value={localMax}
          onChange={handleMaxChange}
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />
      </Box>
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
