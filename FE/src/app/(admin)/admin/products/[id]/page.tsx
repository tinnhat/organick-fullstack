'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BaseCard from '../../components/shared/BaseCard'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { faSignLanguage } from '@fortawesome/free-solid-svg-icons'

type Props = {}

type MyFormValues = {
  name: string
  description?: string
  additionalInfo?: string
  quantity: number
  price: number
  priceSale?: number
  categoryId: string
  star?: number
  _destroy: boolean
  slug?: string
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  description: yup.string(),
  additionalInfo: yup.string(),
  quantity: yup.number().required('Quantity is required').min(1).max(999),
  price: yup.number().required('Price is required').min(1).max(99999),
  priceSale: yup.number(),
  categoryId: yup.string(),
  star: yup.number().min(0).max(5),
  _destroy: yup.boolean(),
  slug: yup.string(),
})

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function OrderDetail({}: Props) {
  const params = useParams()
  const route = useRouter()
  const [file, setFile] = useState<File | undefined>(undefined)
  const [category, setCategory] = useState('')

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }

  const initialValues: MyFormValues = {
    name: '',
    description: '',
    additionalInfo: '',
    quantity: 0,
    price: 0,
    priceSale: 0,
    categoryId: '',
    star: 0,
    _destroy: false,
    slug: '',
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0])
  }

  return (
    <div>
      <BaseCard title={`Product - ${params.id}`}>
        <>
          <Box>
            <Typography variant='h6'>Image</Typography>
            <Button
              component='label'
              role={undefined}
              variant='contained'
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              size='small'
              sx={{
                mt: 2,
              }}
            >
              Upload file
              <VisuallyHiddenInput type='file' onChange={handleChangeImage} />
            </Button>
            <br />
            <Avatar
              alt='avatar'
              src={file ? URL.createObjectURL(file!) : '/images/users/avatar-default.jpg'}
              sx={{
                height: 200,
                width: 200,
                mt: 2,
                mb: 2,
                border: '1px solid #ccc',
                borderRadius: '0',
              }}
            />
          </Box>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              console.log(values, category)
              setTimeout(() => {
                actions.setSubmitting(false)
              }, 1000)
            }}
          >
            {({ isSubmitting, errors, values, touched, handleChange }) => {
              const {
                name,
                description,
                additionalInfo,
                quantity,
                price,
                priceSale,
                categoryId,
                star,
                _destroy,
                slug,
              } = values
              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='name'
                        label='Name'
                        variant='outlined'
                        value={name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <FormControl fullWidth>
                        <InputLabel id='select-cate'>Category</InputLabel>
                        <Select
                          labelId='select-cate'
                          id='simple-select'
                          value={category}
                          label='Category'
                          onChange={handleChangeSelect}
                        >
                          <MenuItem value={'1'}>Fruit</MenuItem>
                          <MenuItem value={'2'}>Snack</MenuItem>
                          <MenuItem value={'3'}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='description'
                        label='Description'
                        variant='outlined'
                        value={description}
                        onChange={handleChange}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                        multiline
                        minRows={4}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='additionalInfo'
                        label='Additional Info'
                        variant='outlined'
                        value={additionalInfo}
                        onChange={handleChange}
                        error={touched.additionalInfo && Boolean(errors.additionalInfo)}
                        helperText={touched.additionalInfo && errors.additionalInfo}
                        multiline
                        minRows={4}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='quantity'
                        label='Quantity'
                        variant='outlined'
                        value={quantity}
                        onChange={handleChange}
                        error={touched.quantity && Boolean(errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='price'
                        label='Price'
                        variant='outlined'
                        value={price}
                        onChange={handleChange}
                        error={touched.price && Boolean(errors.price)}
                        helperText={touched.price && errors.price}
                        type='number'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='priceSale'
                        label='Price Sale'
                        variant='outlined'
                        value={priceSale}
                        onChange={handleChange}
                        error={touched.priceSale && Boolean(errors.priceSale)}
                        helperText={touched.priceSale && errors.priceSale}
                        type='number'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='star'
                        label='Default Star Review'
                        variant='outlined'
                        value={star}
                        onChange={handleChange}
                        error={touched.star && Boolean(errors.star)}
                        helperText={touched.star && errors.star}
                        type='number'
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        fullWidth
                        id='slug'
                        label='Slug'
                        variant='outlined'
                        value={slug}
                        onChange={handleChange}
                        error={touched.slug && Boolean(errors.slug)}
                        helperText={touched.slug && errors.slug}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <FormControl component='fieldset' variant='standard'>
                          <FormLabel component='legend'>Status</FormLabel>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={_destroy}
                                  onChange={handleChange}
                                  value={_destroy}
                                  name='_destroy'
                                />
                              }
                              label='Deleted'
                            />
                          </FormGroup>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                      Save
                    </Button>
                    <Button variant='outlined' onClick={() => route.back()}>
                      Back
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </>
      </BaseCard>
    </div>
  )
}
