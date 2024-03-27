import { useAddProductMutation } from '@/app/utils/hooks/productsHooks'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import useFetch from '@/app/utils/useFetch'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Avatar,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'
type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
  refetch: () => void
}

type MyFormValues = {
  name: string
  description?: string
  quantity: number
  price: number
  priceSale?: number
  categoryId: string
  star?: number
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

export default function AddProduct({ open, toggleDrawer, refetch }: Props) {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [category, setCategory] = useState('')
  const [categoryOption, setCategoryOption] = useState<Category[]>([])
  const fetchApi = useFetch()
  const { mutateAsync: addProduct } = useAddProductMutation(fetchApi)
  const { data: allCategory } = useGetCategoriesQuery()
  const handleChangeSelect = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }
  const handleClose = () => {
    toggleDrawer(false)
    setFile(undefined)
  }

  useEffect(() => {
    if (allCategory) {
      const option = allCategory.filter((item: Category) => item._destroy === false)
      setCategoryOption(option)
    }
  }, [allCategory])

  const initialValues: MyFormValues = {
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    priceSale: 0,
    categoryId: '',
    star: 0,
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0])
  }

  const handleSubmit = async (values: any, actions: any) => {
    if (!file) {
      toast.warning('Please select image', { position: 'bottom-left' })
      return
    }
    if (!category) {
      toast.warning('Please select category', { position: 'bottom-left' })
      return
    }
    const result = await addProduct({
      ...values,
      file,
      categoryId: category
    })
    if (result) {
      actions.resetForm()
      toggleDrawer(false)
      refetch()
      setFile(undefined)
      toast.success('Product added successfully', { position: 'bottom-right' })
    }
  }

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '50vw', lg: '30vw' },
        },
      }}
      variant='temporary'
      anchor='right'
      open={open}
    >
      <Box sx={{ padding: 2 }}>
        <Typography sx={{ mb: 4 }} variant='h5'>
          Add Product
        </Typography>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Typography variant='h6' sx={{ mb: 1 }}>
            Image
          </Typography>
          <Button
            component='label'
            role={undefined}
            variant='contained'
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            size='small'
          >
            Upload file
            <VisuallyHiddenInput type='file' onChange={handleChangeImage} />
          </Button>
          <br />
          {file && (
            <Avatar
              alt='product'
              src={URL.createObjectURL(file!)}
              sx={{
                height: 200,
                width: 200,
                mt: 2,
                mb: 2,
                border: '1px solid #ccc',
                borderRadius: '0',
              }}
            />
          )}
        </Box>
        {file && (
          <Button
            size='small'
            variant='contained'
            color='error'
            sx={{ mb: 2 }}
            onClick={() => setFile(undefined)}
          >
            Remove avatar
          </Button>
        )}
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, touched, handleChange }) => {
            const { name, description, quantity, price, priceSale, categoryId, star } = values
            return (
              <Form>
                <Stack spacing={2}>
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
                  <FormControl fullWidth>
                    <InputLabel id='select-cate'>Category</InputLabel>
                    <Select
                      labelId='select-cate'
                      id='simple-select'
                      value={category}
                      label='Category'
                      onChange={handleChangeSelect}
                    >
                      {categoryOption.map((item: Category) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex' }}>
                    <Button type='submit' disabled={isSubmitting} variant='contained'>
                      Add
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
