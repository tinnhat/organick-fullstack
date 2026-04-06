'use client'
import { useValidateCouponQuery } from '@/app/utils/hooks/couponHooks'
import { useState } from 'react'
import { toast } from 'sonner'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface ApplyCouponProps {
  onApply: (coupon: {
    code: string
    type: 'percentage' | 'fixed'
    value: number
    discount: number
  }) => void
  onRemove: () => void
  totalAmount: number
  appliedCoupon?: {
    code: string
    type: 'percentage' | 'fixed'
    value: number
    discount: number
  } | null
}

export default function ApplyCoupon({ onApply, onRemove, totalAmount, appliedCoupon }: ApplyCouponProps) {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validatedCoupon, setValidatedCoupon] = useState<any>(null)

  const { refetch } = useValidateCouponQuery(code, false)

  const handleValidate = async () => {
    if (!code.trim()) {
      setValidationError('Please enter a coupon code')
      return
    }

    setIsValidating(true)
    setValidationError(null)

    try {
      const res = await fetch(`${process.env.HOST_BE}/coupons/validate/${code}`, {
        method: 'GET',
      })
      const result = await res.json()

      if (result.error) {
        setValidationError(result.message || 'Invalid coupon code')
        setValidatedCoupon(null)
        return
      }

      const couponData = result.data

      if (!couponData.isActive) {
        setValidationError('This coupon is no longer active')
        setValidatedCoupon(null)
        return
      }

      if (new Date(couponData.expiresAt) < new Date()) {
        setValidationError('This coupon has expired')
        setValidatedCoupon(null)
        return
      }

      if (couponData.maxUses && couponData.usedCount >= couponData.maxUses) {
        setValidationError('This coupon has reached its maximum uses')
        setValidatedCoupon(null)
        return
      }

      if (totalAmount < couponData.minOrder) {
        setValidationError(`Minimum order amount is $${couponData.minOrder}`)
        setValidatedCoupon(null)
        return
      }

      let discount = 0
      if (couponData.type === 'percentage') {
        discount = (totalAmount * couponData.value) / 100
      } else {
        discount = couponData.value
      }

      discount = Math.min(discount, totalAmount)

      setValidatedCoupon({
        ...couponData,
        discount,
      })
      setValidationError(null)
    } catch (error) {
      setValidationError('Failed to validate coupon. Please try again.')
      setValidatedCoupon(null)
    } finally {
      setIsValidating(false)
    }
  }

  const handleApply = () => {
    if (!validatedCoupon) return

    onApply({
      code: validatedCoupon.code,
      type: validatedCoupon.type,
      value: validatedCoupon.value,
      discount: validatedCoupon.discount,
    })

    toast.success(`Coupon "${validatedCoupon.code}" applied successfully!`, {
      position: 'top-center',
    })

    setCode('')
    setValidatedCoupon(null)
  }

  const handleRemove = () => {
    onRemove()
    setValidatedCoupon(null)
    setValidationError(null)
    toast.info('Coupon removed', {
      position: 'top-center',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (appliedCoupon) {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'success.light',
          border: '1px solid',
          borderColor: 'success.main',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='subtitle2' color='success.dark' fontWeight='bold'>
              Applied Coupon: {appliedCoupon.code}
            </Typography>
            <Typography variant='body2' color='success.dark'>
              {appliedCoupon.type === 'percentage'
                ? `${appliedCoupon.value}% off`
                : `${formatCurrency(appliedCoupon.value)} off`}
              {' - '}
              Save {formatCurrency(appliedCoupon.discount)}
            </Typography>
          </Box>
          <Button variant='text' color='error' size='small' onClick={handleRemove}>
            Remove
          </Button>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant='subtitle2' gutterBottom>
        Have a coupon?
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size='small'
          placeholder='Enter coupon code'
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setValidationError(null)
            setValidatedCoupon(null)
          }}
          error={!!validationError}
          disabled={isValidating}
          data-testid="coupon-input"
        />
        <Button
          variant='contained'
          onClick={handleValidate}
          disabled={!code.trim() || isValidating}
          sx={{ whiteSpace: 'nowrap' }}
          data-testid="apply-coupon"
        >
          {isValidating ? <CircularProgress size={20} color='inherit' /> : 'Validate'}
        </Button>
      </Box>

      {validationError && (
        <Typography variant='body2' color='error' sx={{ mt: 1 }}>
          {validationError}
        </Typography>
      )}

      {validatedCoupon && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: 'success.light',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'success.main',
            }}
          >
            <Typography variant='body2' color='success.dark' fontWeight='bold'>
              {validatedCoupon.code} - {validatedCoupon.type === 'percentage' ? `${validatedCoupon.value}% off` : `${formatCurrency(validatedCoupon.value)} off`}
            </Typography>
            <Typography variant='body2' color='success.dark'>
              You save: {formatCurrency(validatedCoupon.discount)}
            </Typography>
            <Button
              variant='contained'
              color='success'
              size='small'
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleApply}
            >
              Apply Coupon
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
