'use client'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import BaseCard from '../components/shared/BaseCard'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import { useUpdatePasswordMutation } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'



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

export default function ChangePassword() {
  const fetchApi = useFetch()
  const { data: session } = useSession()
  const initialValues: InfoPassword = { password: '', newPassword: '', confirmPassword: '' }
  const { mutateAsync: updatePassword } = useUpdatePasswordMutation(fetchApi, session?.user._id)
  const handleChangePassword = async (values: any, actions: any) => {
    const result = await updatePassword({
      password: values.password,
      newPassword: values.newPassword,
    })
    if (result) {
      toast.success('Change password successfully, please login again', {
        position: 'top-center',
      })
      actions.resetForm()
      setTimeout(() => {
        signOut({ callbackUrl: '/login' })
      }, 3000)
    }
  }
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
                onSubmit={handleChangePassword}
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
                          helperText={touched.password && errors.password}
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
                          helperText={touched.newPassword && errors.newPassword}
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
                          helperText={touched.confirmPassword && errors.confirmPassword}
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
