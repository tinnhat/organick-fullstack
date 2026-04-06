import { useAddCouponMutation, useEditCouponMutation } from '@/app/utils/hooks/couponHooks'
import useFetch from '@/app/utils/useFetch'
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
  refetch: () => void
  coupon?: any
}

type MyFormValues = {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxUses: number
  expiresAt: string
  isActive: boolean
}

const validationSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .min(4, 'Code should be of minimum 4 characters length')
    .max(20, 'Code should be of maximum 20 characters length'),
  type: yup.string().required('Type is required').oneOf(['percentage', 'fixed']),
  value: yup.number().required('Value is required').min(0),
  minOrder: yup.number().required('Min order is required').min(0),
  maxUses: yup.number().required('Max uses is required').min(1),
  expiresAt: yup.string().required('Expiration date is required'),
  isActive: yup.boolean(),
})

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function AddCoupon({ open, toggleDrawer, refetch, coupon }: Props) {
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage')
  const [isActive, setIsActive] = useState(true)
  const fetchApi = useFetch()
  const { mutateAsync: addCoupon } = useAddCouponMutation(fetchApi)
  const { mutateAsync: editCoupon } = useEditCouponMutation(fetchApi, coupon?._id || '')

  const handleChangeType = (event: SelectChangeEvent) => {
    setCouponType(event.target.value as 'percentage' | 'fixed')
  }

  const handleClose = () => {
    toggleDrawer(false)
  }

  const isEditing = !!coupon

  const initialValues: MyFormValues = {
    code: coupon?.code || '',
    type: coupon?.type || 'percentage',
    value: coupon?.value || 0,
    minOrder: coupon?.minOrder || 0,
    maxUses: coupon?.maxUses || 1,
    expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
    isActive: coupon?.isActive ?? true,
  }

  const handleAutoGenerateCode = (setFieldValue: (field: string, value: any) => void) => {
    const newCode = generateCouponCode()
    setFieldValue('code', newCode)
  }

  const handleSubmit = async (values: any, actions: any) => {
    try {
      if (isEditing) {
        await editCoupon({
          ...values,
        })
        toast.success('Coupon updated successfully', { position: 'bottom-right' })
      } else {
        await addCoupon({
          ...values,
        })
        toast.success('Coupon added successfully', { position: 'bottom-right' })
      }
      actions.resetForm()
      toggleDrawer(false)
      refetch()
    } catch (error) {
      toast.error('Something went wrong', { position: 'bottom-right' })
    }
  }

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '50vw', lg: '40vw' },
        },
      }}
      variant='temporary'
      anchor='right'
      open={open}
    >
      <Box sx={{ padding: 2 }}>
        <Typography sx={{ mb: 4 }} variant='h5'>
          {isEditing ? 'Edit Coupon' : 'Add Coupon'}
        </Typography>
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, values, touched, handleChange, setFieldValue }) => {
            return (
              <Form>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      fullWidth
                      id='code'
                      label='Code'
                      variant='outlined'
                      value={values.code}
                      onChange={handleChange}
                      error={touched.code && Boolean(errors.code)}
                      helperText={touched.code && errors.code}
                      disabled={isEditing}
                    />
                    {!isEditing && (
                      <Button
                        variant='contained'
                        onClick={() => handleAutoGenerateCode(setFieldValue)}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Auto Generate
                      </Button>
                    )}
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel id='select-type'>Type</InputLabel>
                    <Select
                      labelId='select-type'
                      id='simple-select-type'
                      value={couponType}
                      label='Type'
                      onChange={(e) => {
                        handleChangeType(e)
                        setFieldValue('type', e.target.value)
                      }}
                    >
                      <MenuItem value='percentage'>Percentage</MenuItem>
                      <MenuItem value='fixed'>Fixed Amount</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    id='value'
                    label={couponType === 'percentage' ? 'Percentage (%)' : 'Value ($)'}
                    variant='outlined'
                    value={values.value}
                    onChange={handleChange}
                    error={touched.value && Boolean(errors.value)}
                    helperText={touched.value && errors.value}
                    type='number'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {couponType === 'percentage' ? '%' : '$'}
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        max: couponType === 'percentage' ? 100 : undefined,
                        step: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    id='minOrder'
                    label='Min Order Amount ($)'
                    variant='outlined'
                    value={values.minOrder}
                    onChange={handleChange}
                    error={touched.minOrder && Boolean(errors.minOrder)}
                    helperText={touched.minOrder && errors.minOrder}
                    type='number'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>$</InputAdornment>,
                      inputProps: {
                        min: 0,
                        step: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    id='maxUses'
                    label='Max Uses'
                    variant='outlined'
                    value={values.maxUses}
                    onChange={handleChange}
                    error={touched.maxUses && Boolean(errors.maxUses)}
                    helperText={touched.maxUses && errors.maxUses}
                    type='number'
                    InputProps={{
                      inputProps: {
                        min: 1,
                        step: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    id='expiresAt'
                    label='Expiration Date'
                    variant='outlined'
                    value={values.expiresAt}
                    onChange={handleChange}
                    error={touched.expiresAt && Boolean(errors.expiresAt)}
                    helperText={touched.expiresAt && errors.expiresAt}
                    type='date'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel id='select-active'>Status</InputLabel>
                    <Select
                      labelId='select-active'
                      id='simple-select-active'
                      value={values.isActive.toString()}
                      label='Status'
                      onChange={(e) => {
                        const val = e.target.value === 'true'
                        setIsActive(val)
                        setFieldValue('isActive', val)
                      }}
                    >
                      <MenuItem value='true'>Active</MenuItem>
                      <MenuItem value='false'>Inactive</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex' }}>
                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                      {isEditing ? 'Update' : 'Add'}
                    </Button>
                    <Button
                      variant='outlined'
                      sx={{
                        ml: 2,
                      }}
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Drawer>
  )
}
