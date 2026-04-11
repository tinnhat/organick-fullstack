'use client'
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'
import { useState } from 'react'
import StarRating from '../rating/StarRating'

interface ReviewFormProps {
  productId: string
  canReview?: boolean
  canReviewReason?: string
  existingReview?: {
    _id: string
    rating: number
    comment: string
  }
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>
  onCancel?: () => void
}

export default function ReviewForm({
  productId,
  canReview = false,
  canReviewReason,
  existingReview,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!canReview && !existingReview) {
      setError(canReviewReason || 'You cannot review this product')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ rating, comment })
      setSuccess(true)
      if (!existingReview) {
        setRating(0)
        setComment('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !canReview && !existingReview

  return (
    // ============ FEATURE: shop-ui START ============
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600, color: '#274c5b' }}>
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 2 }}>
          {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
          Your Rating *
        </Typography>
        <StarRating value={rating} onChange={isDisabled ? undefined : setRating} size='large' />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label='Your Review *'
        placeholder={isDisabled ? canReviewReason || 'You cannot review this product' : 'Share your experience with this product...'}
        value={comment}
        onChange={(e) => !isDisabled && setComment(e.target.value)}
        sx={{ mb: 3 }}
        inputProps={{ minLength: 10, disabled: isDisabled }}
        disabled={isDisabled}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          disabled={loading || isDisabled}
          sx={{
            bgcolor: '#7eb693',
            '&:hover': { bgcolor: '#6aa583' },
            minWidth: 120,
          }}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : existingReview ? 'Update' : 'Submit'}
        </Button>
        {onCancel && (
          <Button
            variant='outlined'
            onClick={onCancel}
            disabled={loading}
            sx={{
              color: '#274c5b',
              borderColor: '#274c5b',
              '&:hover': { borderColor: '#7eb693', bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
    // ============ FEATURE: shop-ui END ============
  )
}
