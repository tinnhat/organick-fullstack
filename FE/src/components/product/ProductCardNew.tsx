'use client'
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ProductCardNewProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ProductCardNew({ product, onQuickView }: ProductCardNewProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const hasSale = product.priceSale && product.priceSale > 0
  const salePercent = hasSale
    ? Math.round(((product.price - product.priceSale) / product.price) * 100)
    : 0

  const handleCardClick = () => {
    router.push(`/shop/${product.slug}/${product._id}`)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    // ============ FEATURE: shop-ui START ============
    <Box
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.08)',
        '&:hover .product-image': {
          transform: 'scale(1.05)',
        },
        '&:hover .product-overlay': {
          opacity: 1,
        },
      }}
    >
      {hasSale && (
        <Chip
          label={`-${salePercent}%`}
          size='small'
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            bgcolor: '#e74c3c',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      )}

      {product.quantity === 0 && (
        <Chip
          label='Sold Out'
          size='small'
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            bgcolor: '#274c5b',
            color: 'white',
            fontWeight: 600,
          }}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          height: 240,
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        {product.image && !imageError ? (
          <Image
            src={typeof product.image === 'string' ? product.image : '/assets/img/placeholder.webp'}
            alt={product.name}
            className='product-image'
            fill
            sizes='(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw'
            style={{
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#e0e0e0',
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              No Image
            </Typography>
          </Box>
        )}

        <Box
          className='product-overlay'
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(39, 76, 91, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Tooltip title='Add to Cart'>
            <IconButton
              onClick={handleAddToCart}
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#7eb693', color: 'white' },
                width: 44,
                height: 44,
              }}
            >
              <ShoppingCartIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Quick View'>
            <IconButton
              onClick={handleQuickView}
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#7eb693', color: 'white' },
                width: 44,
                height: 44,
              }}
            >
              <VisibilityIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Wishlist'>
            <IconButton
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#7eb693', color: 'white' },
                width: 44,
                height: 44,
              }}
            >
              <FavoriteBorderIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography
          variant='caption'
          sx={{
            color: '#7eb693',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: '0.7rem',
          }}
        >
          {product.category?.[0]?.name || 'Uncategorized'}
        </Typography>

        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            color: '#274c5b',
            mt: 0.5,
            mb: 1,
            fontSize: '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              style={{
                fontSize: '0.75rem',
                color: i < (product.star || 0) ? '#ffa858' : '#d4d4d4',
              }}
            />
          ))}
          <Typography variant='caption' sx={{ ml: 0.5, color: 'text.secondary' }}>
            ({product.reviewCount || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 700,
              color: hasSale ? '#e74c3c' : '#274c5b',
              fontSize: '1.1rem',
            }}
          >
            ${hasSale ? product.priceSale : product.price}
          </Typography>
          {hasSale && (
            <Typography
              variant='body2'
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ${product.price}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
