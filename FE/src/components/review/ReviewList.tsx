'use client'
import { Box, Typography, Avatar, Button, IconButton, Tooltip, Pagination, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StarRating from '../rating/StarRating'
import { useState } from 'react'
import { format } from 'date-fns'

interface Review {
  _id: string
  userId: {
    _id: string
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  currentUserId?: string
  orderCreatedAt?: string
  onEdit?: (review: Review) => void
  onDelete?: (reviewId: string) => void
  onPageChange?: (page: number) => void
  currentPage?: number
  pageSize?: number
}

export default function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  currentUserId,
  orderCreatedAt,
  onEdit,
  onDelete,
  onPageChange,
  currentPage = 1,
  pageSize = 5,
}: ReviewListProps) {
  const pageCount = Math.ceil(totalReviews / pageSize)

  const canModify = (review: Review) => {
    if (!currentUserId || !orderCreatedAt) return false
    if (review.userId._id !== currentUserId) return false
    
    const orderDate = new Date(orderCreatedAt)
    const now = new Date()
    const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    
    return daysDiff <= 5
  }

  const handleEdit = (review: Review) => {
    onEdit?.(review)
  }

  const handleDelete = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDelete?.(reviewId)
    }
  }

  return (
    // ============ FEATURE: shop-ui START ============
    <Box>
      <Box
        sx={{
          p: 3,
          mb: 3,
          bgcolor: '#f5f8f5',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h3' sx={{ fontWeight: 700, color: '#274c5b' }}>
            {averageRating.toFixed(1)}
          </Typography>
          <StarRating value={averageRating} readOnly size='small' />
          <Typography variant='body2' sx={{ mt: 0.5, color: 'text.secondary' }}>
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, color: '#274c5b' }}>
            Customer Reviews
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Verified purchasers have shared their honest feedback
          </Typography>
        </Box>
      </Box>

      {reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant='body1' color='text.secondary'>
            No reviews yet. Be the first to review this product!
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Box
                key={review._id}
                sx={{
                  p: 3,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      src={review.userId.avatar}
                      alt={review.userId.name}
                      sx={{ width: 48, height: 48 }}
                    >
                      {review.userId.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600, color: '#274c5b' }}>
                        {review.userId.name}
                      </Typography>
                      <StarRating value={review.rating} readOnly size='small' />
                      <Typography variant='caption' color='text.secondary'>
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                  {canModify(review) && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title='Edit Review'>
                        <IconButton size='small' onClick={() => handleEdit(review)}>
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete Review'>
                        <IconButton size='small' onClick={() => handleDelete(review._id)} sx={{ color: 'error.main' }}>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Typography variant='body2' sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                  {review.comment}
                </Typography>
              </Box>
            ))}
          </Box>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(_, page) => onPageChange?.(page)}
                color='primary'
                shape='rounded'
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#274c5b',
                  },
                  '& .MuiPaginationItem-selected': {
                    bgcolor: '#7eb693',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#6aa583',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
