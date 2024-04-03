'use client'
import React, { useEffect, useState } from 'react'
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
import useFetch from '@/app/utils/useFetch'
import { useEditProductMutation, useGetProductByIdQuery } from '@/app/utils/hooks/productsHooks'
import Loading from '../../loading'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import { toast } from 'sonner'



type MyFormValues = {
  name: string
  description?: string
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

export default function ProductDetail() {
  const fetchApi = useFetch()
  const params = useParams()
  const route = useRouter()
  const { data: allCategory } = useGetCategoriesQuery()
  const [categoryOption, setCategoryOption] = useState<Category[]>([])
  const { data: productInfo, isLoading } = useGetProductByIdQuery(params.id.toString())
  const { mutateAsync: editProduct } = useEditProductMutation(fetchApi, params.id.toString())

  const [file, setFile] = useState<File | undefined>(undefined)
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (allCategory) {
      const option = allCategory.filter((item: Category) => item._destroy === false)
      setCategoryOption(option)
    }
  }, [allCategory])
  const handleChangeSelect = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }

  useEffect(() => {
    if (productInfo) {
      setCategory(productInfo.category[0]._id)
    }
  }, [productInfo])

  const initialValues: MyFormValues = {
    name: '',
    description: '',
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

  if (isLoading) return <Loading />

  const handleSubmit = async (values: any, actions: any) => {
    const result = await editProduct({ ...values, categoryId: category, file })
    if (result) {
      toast.success('Product updated successfully', { position: 'bottom-right' })
    }
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
              src={file ? URL.createObjectURL(file!) : productInfo?.image}
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
            enableReinitialize={true}
            initialValues={
              {
                name: productInfo?.name,
                description: productInfo?.description,
                quantity: productInfo?.quantity,
                price: productInfo?.price,
                priceSale: productInfo?.priceSale,
                categoryId: productInfo?.categoryId,
                star: productInfo?.star,
                _destroy: productInfo?._destroy,
                slug: productInfo?.slug,
              } || initialValues
            }
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, values, touched, handleChange }) => {
              const {
                name,
                description,
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
                        helperText={touched.name && (errors.name as string)}
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
                          {categoryOption.map(item => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <TextField
                        fullWidth
                        id='description'
                        label='Description'
                        variant='outlined'
                        value={description}
                        onChange={handleChange}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && (errors.description as string)}
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
                        helperText={touched.quantity && (errors.quantity as string)}
                        type='number'
                        InputProps={{
                          inputProps: {
                            max: 999,
                            min: 1,
                            step: 1,
                          },
                        }}
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
                        helperText={touched.price && (errors.price as string)}
                        type='number'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                          inputProps: {
                            max: 999,
                            min: 1,
                            step: 1,
                          },
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
                        helperText={touched.priceSale && (errors.priceSale as string)}
                        type='number'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                          inputProps: {
                            max: 999,
                            min: 1,
                            step: 1,
                          },
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
                        helperText={touched.star && (errors.star as string)}
                        type='number'
                        InputProps={{
                          inputProps: {
                            max: 5,
                            min: 1,
                            step: 1,
                          },
                        }}
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
                        helperText={touched.slug && (errors.slug as string)}
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
