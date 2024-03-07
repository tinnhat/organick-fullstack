import { Box, Stack, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import React from 'react'
import { useFormik, Formik, Field, Form } from 'formik'
import * as yup from 'yup'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}
type MyFormValues = {
  email: string
  fullname: string
  password: string
  confirmPassword: string
}

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
})

export default function AddUser({ open, toggleDrawer }: Props) {
  const handleClose = () => {
    toggleDrawer(false)
  }
  const initialValues: MyFormValues = { email: '', fullname: '', password: '', confirmPassword: '' }

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
          Add User
        </Typography>
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log(values)
            setTimeout(() => {
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ isSubmitting, errors, values, touched, handleChange }) => {
            const { email, fullname, password, confirmPassword } = values
            return (
              <Form>
                <Stack spacing={2}>
                  <TextField
                    type='email'
                    fullWidth
                    id='email'
                    label='Email'
                    variant='outlined'
                    value={email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    id='fullname'
                    label='Full name'
                    variant='outlined'
                    value={fullname}
                    onChange={handleChange}
                    error={touched.fullname && Boolean(errors.fullname)}
                    helperText={touched.fullname && errors.fullname}
                  />
                  <TextField
                    type='password'
                    fullWidth
                    id='password'
                    label='Password'
                    variant='outlined'
                    value={password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <TextField
                    type='password'
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    variant='outlined'
                    value={confirmPassword}
                    onChange={handleChange}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
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
