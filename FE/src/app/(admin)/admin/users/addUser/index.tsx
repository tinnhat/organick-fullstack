import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import React, { useState } from 'react'
import { useFormik, Formik, Field, Form } from 'formik'
import * as yup from 'yup'
import TextFieldPassword from '../../components/password'
import Image from 'next/image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}
type MyFormValues = {
  email: string
  fullname: string
  password: string
  confirmPassword: string
  isAdmin: boolean
  isConfirm: boolean
}

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
  const [file, setFile] = useState<File | undefined>(undefined)

  const handleClose = () => {
    toggleDrawer(false)
    setFile(undefined)
  }
  const initialValues: MyFormValues = {
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    isConfirm: false,
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
          Add User
        </Typography>
        <Box>
          <Typography variant='h6'>Avatar</Typography>
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
          <Avatar
            alt='avatar'
            src={file ? URL.createObjectURL(file!) : '/images/users/avatar-default.webp'}
            sx={{ height: 80, width: 80, mt: 2, mb: 2, border: '1px solid #ccc' }}
          />
        </Box>
        {file && (
          <Button
            size='small'
            sx={{ mb: 2 }}
            variant='contained'
            color='error'
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
            console.log(values)
            setTimeout(() => {
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ isSubmitting, errors, values, touched, handleChange }) => {
            const { email, fullname, password, confirmPassword, isAdmin, isConfirm } = values
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
                  <TextFieldPassword
                    id='password'
                    label='Password'
                    variant='outlined'
                    value={password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <TextFieldPassword
                    id='confirmPassword'
                    label='Confirm Password'
                    variant='outlined'
                    value={confirmPassword}
                    onChange={handleChange}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'>Permission</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isAdmin}
                              onChange={handleChange}
                              value={isAdmin}
                              name='isAdmin'
                            />
                          }
                          label='Admin'
                        />
                      </FormGroup>
                    </FormControl>
                    <FormControl component='fieldset' variant='standard'>
                      <FormLabel component='legend'>Active</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isConfirm}
                              value={isConfirm}
                              onChange={handleChange}
                              name='isConfirm'
                            />
                          }
                          label='Confirm'
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
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
