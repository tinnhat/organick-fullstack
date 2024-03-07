'use client'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import BaseCard from '../components/shared/BaseCard'
import * as yup from 'yup'
import { Form, Formik } from 'formik'

type Props = {}

type Info = {
  email: string
  fullname: string
}

const validationSchema = yup.object({
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
})

export default function MyProfile({}: Props) {
  const router = useRouter()
  const initialValues: Info = { email: '', fullname: '' }
  return (
    <div className='my-profile'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='My Information'>
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
                  const { email, fullname } = values
                  return (
                    <Form>
                      <Stack spacing={3}>
                        <TextField
                          sx={{ width: '50%' }}
                          id='fullname'
                          label='Full name'
                          variant='outlined'
                          value={fullname}
                          onChange={handleChange}
                          error={touched.fullname && Boolean(errors.fullname)}
                          helperText={touched.fullname && errors.fullname}
                        />
                        <TextField
                          sx={{ width: '50%' }}
                          id='email'
                          label='Email'
                          value={email}
                          disabled
                        />
                      </Stack>
                      <Button disabled={isSubmitting} type='submit' variant='contained' color='primary' sx={{ mt: 3 }}>
                        Save
                      </Button>
                      <Button
                        variant='outlined'
                        color='primary'
                        sx={{ mt: 3, ml: 3 }}
                        onClick={() => router.push('/admin/change-password')}
                      >
                        Change Password
                      </Button>
                    </Form>
                  )
                }}
              </Formik>
            </>
          </BaseCard>
        </Grid>
      </Grid>
    </div>
  )
}
