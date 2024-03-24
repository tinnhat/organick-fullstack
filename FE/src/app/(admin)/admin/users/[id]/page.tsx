'use client'
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
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import * as yup from 'yup'
import BaseCard from '../../components/shared/BaseCard'
import { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

type Props = {}

type MyFormValues = {
  email: string
  fullname: string
  isAdmin: boolean
  isConfirm: boolean
  _destroy: boolean
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
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
})

export default function OrderDetail({}: Props) {
  const [file, setFile] = useState<File | undefined>(undefined)
  const params = useParams()
  const route = useRouter()

  const initialValues: MyFormValues = {
    email: '',
    fullname: '',
    isAdmin: false,
    isConfirm: false,
    _destroy: false,
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0])
  }

  return (
    <div>
      <BaseCard title={`User - ${params.id}`}>
        <>
          <Box>
            <Typography variant='h6'>Avatar</Typography>
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
              const { email, fullname, isAdmin, isConfirm, _destroy } = values
              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sm={12}>
                      <TextField
                        type='email'
                        fullWidth
                        id='email'
                        label='Email'
                        variant='outlined'
                        value={email}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
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
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
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
                        <FormControl component='fieldset' variant='standard'>
                          <FormLabel component='legend'>Status</FormLabel>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={_destroy}
                                  value={_destroy}
                                  onChange={handleChange}
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
                    <Button variant='contained'>Reset password</Button>
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
