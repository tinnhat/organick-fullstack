'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import BaseCard from '../../components/shared/BaseCard'
import { Form, Formik } from 'formik'
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
  TextField,
} from '@mui/material'

type Props = {}

type MyFormValues = {
  name: string
  _destroy: boolean
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  _destroy: yup.boolean(),
})

export default function OrderDetail({}: Props) {
  const params = useParams()
  const route = useRouter()

  const initialValues: MyFormValues = {
    name: '',
    _destroy: false,
  }

  return (
    <div>
      <BaseCard title={`Category - ${params.id}`}>
        <>
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
              const { name, _destroy } = values
              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} sm={12}>
                      <TextField
                        sx={{ width: '50%' }}
                        id='name'
                        label='Name'
                        variant='outlined'
                        value={name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
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
