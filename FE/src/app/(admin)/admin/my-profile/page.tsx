'use client'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import BaseCard from '../components/shared/BaseCard'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Avatar, Box, Typography, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useSession } from 'next-auth/react'
import { useGetUserInfoQuery, useUpdateUserInfoMutation } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import Loading from '../loading'
import client from '@/app/client'
import { toast } from 'sonner'

type Props = {}

type Info = {
  email: string
  fullname: string
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

export default function MyProfile({}: Props) {
  const [file, setFile] = useState<File | undefined>(undefined)
  const fetchApi = useFetch()
  const { data: session, update } = useSession()
  const { data: userInfo, isLoading } = useGetUserInfoQuery(fetchApi, session?.user._id)
  const { mutateAsync: updateInfo } = useUpdateUserInfoMutation(fetchApi, session?.user._id)
  const router = useRouter()
  const initialValues: Info = { email: '', fullname: '' }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0])
  }
  const handleSubmit = async (values: any, actions: any) => {
    const result = await updateInfo({
      ...values,
      file,
    })
    if (result) {
      await update({
        ...session,
        user: {
          ...session!.user,
          fullname: values.fullname,
        },
      })
      client.setQueryData(['User Information'], result)
      toast.success('User updated successfully', { position: 'bottom-right' })
      setFile(undefined)
    }
  }

  if (isLoading) return <Loading />
  return (
    <div className='my-profile'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <BaseCard title='My Information'>
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
                  src={file ? URL.createObjectURL(file!) : userInfo?.avatar}
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
                enableReinitialize={true}
                initialValues={
                  { email: userInfo?.email, fullname: userInfo?.fullname } || initialValues
                }
                onSubmit={handleSubmit}
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
                          helperText={touched.fullname && (errors.fullname as string)}
                        />
                        <TextField
                          sx={{ width: '50%' }}
                          id='email'
                          label='Email'
                          value={email}
                          disabled
                        />
                      </Stack>
                      <Button
                        disabled={isSubmitting}
                        type='submit'
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3 }}
                      >
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
