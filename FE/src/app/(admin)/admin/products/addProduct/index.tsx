import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}

type MyFormValues = {
  name: string
  description?: string
  additionalInfo?: string
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
  additionalInfo: yup.string(),
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

export default function AddProduct({ open, toggleDrawer }: Props) {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [category, setCategory] = useState('')

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }
  const handleClose = () => {
    toggleDrawer(false)
    setFile(undefined)
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
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0])
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
            } = values
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
                      <MenuItem value={'1'}>Fruit</MenuItem>
                      <MenuItem value={'2'}>Snack</MenuItem>
                      <MenuItem value={'3'}>Thirty</MenuItem>
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
