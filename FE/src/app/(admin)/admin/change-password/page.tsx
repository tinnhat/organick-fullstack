'use client'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import BaseCard from '../components/shared/BaseCard'
import * as yup from 'yup'
import { Form, Formik } from 'formik'

type Props = {}

type InfoPassword = {
  password: string
  newPassword: string
  confirmPassword: string
}

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), undefined], 'Passwords must match'),
})

export default function ChangePassword({}: Props) {
  const initialValues: InfoPassword = { password: '', newPassword: '', confirmPassword: '' }

  return (
    <div className='change-password'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='Change password'>
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
                  const { password, newPassword, confirmPassword } = values
                  return (
                    <Form>
                      <Stack spacing={3}>
                        <TextField
                          sx={{ width: '50%' }}
                          id='password'
                          label='Old Password'
                          type='password'
                          variant='outlined'
                          value={password}
                          onChange={handleChange}
                          error={touched.password && Boolean(errors.password)}
                        />
                        <TextField
                          sx={{ width: '50%' }}
                          id='newPassword'
                          label='New Password'
                          type='password'
                          variant='outlined'
                          value={newPassword}
                          onChange={handleChange}
                          error={touched.newPassword && Boolean(errors.newPassword)}
                        />
                        <TextField
                          sx={{ width: '50%' }}
                          id='confirmPassword'
                          label='Confirm new Password'
                          type='password'
                          variant='outlined'
                          value={confirmPassword}
                          onChange={handleChange}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        />
                      </Stack>
                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3 }}
                      >
                        Change password
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
