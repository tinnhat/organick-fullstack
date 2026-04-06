'use client'
import { Box, IconButton, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'small' | 'medium' | 'large'
  showValue?: boolean
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeMap = {
    small: 20,
    medium: 28,
    large: 36,
  }

  const iconSize = sizeMap[size]
  const displayValue = hoverValue !== null ? hoverValue : value

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const renderStar = (index: number) => {
    const starValue = index + 1

    if (starValue <= Math.floor(displayValue)) {
      return (
        <StarIcon
          key={index}
          sx={{
            fontSize: iconSize,
            color: '#ffa858',
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'transform 0.2s',
            '&:hover': !readOnly ? { transform: 'scale(1.2)' } : {},
          }}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
        />
      )
    } else if (starValue === Math.ceil(displayValue) && displayValue % 1 !== 0) {
      return (
        <StarHalfIcon
          key={index}
          sx={{
            fontSize: iconSize,
            color: '#ffa858',
            cursor: readOnly ? 'default' : 'pointer',
          }}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
        />
      )
    } else {
      return (
        <StarBorderIcon
          key={index}
          sx={{
            fontSize: iconSize,
            color: '#d4d4d4',
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'transform 0.2s',
            '&:hover': !readOnly ? { transform: 'scale(1.2)' } : {},
          }}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
        />
      )
    }
  }

  return (
    // ============ FEATURE: shop-ui START ============
    <Box
      onMouseLeave={handleMouseLeave}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.2 }}>
        {Array.from({ length: 5 }).map((_, i) => renderStar(i))}
      </Box>
      {showValue && (
        <Typography variant='body2' sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
          {value.toFixed(1)}
        </Typography>
      )}
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
