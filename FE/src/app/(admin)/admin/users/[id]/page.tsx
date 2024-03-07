'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import BaseCard from '../../components/shared/BaseCard'
import { useFormik, Formik, Field, Form } from 'formik'
import * as yup from 'yup'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Stack,
  TextField,
} from '@mui/material'
type Props = {}

type MyFormValues = {
  email: string
  fullname: string
  isAdmin: boolean
  isConfirm: boolean
  _destroy: boolean
}

const validationSchema = yup.object({
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
})

export default function OrderDetail({}: Props) {
  const params = useParams()
  const route = useRouter()
  const initialValues: MyFormValues = {
    email: '',
    fullname: '',
    isAdmin: false,
    isConfirm: false,
    _destroy: false,
  }
  return (
    <div>
      <BaseCard title={`User - ${params.id}`}>
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
      </BaseCard>
    </div>
  )
}
