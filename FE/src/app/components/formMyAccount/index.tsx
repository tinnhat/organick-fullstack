'use client'
import {
  useGetUserInfoQuery,
  useUpdatePasswordMutation,
  useUpdateUserInfoMutation,
} from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import LoadingCustom from '../loading'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import ErrorField from '../errorField'
import { toast } from 'sonner'
import client from '@/app/client'



type Info = {
  fullname: string
  email: string
}

type InfoPassword = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const validationSchemaInfo = yup.object({
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
})

const validationSchemaInfoPassword = yup.object({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('New password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), undefined], 'Passwords must match'),
})

export default function FormMyAccount() {
  const fetchApi = useFetch()
  const { data: session, update } = useSession()
  const { data: userInfo, isLoading } = useGetUserInfoQuery(fetchApi, session?.user._id)
  const { mutateAsync: updatePassword } = useUpdatePasswordMutation(fetchApi, session?.user._id)
  const { mutateAsync: updateInfo } = useUpdateUserInfoMutation(fetchApi, session?.user._id)
  const [changePassword, setChangePassword] = useState(false)
  const [file, setFile] = useState<any>()
  const handleChangeImage = (e: any) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }
  const initialValuesUser: Info = { fullname: '', email: '' }
  const initialValuesUserPassword: InfoPassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const getUserInfo = () =>
    ({ fullname: userInfo?.fullname, email: userInfo?.email } || initialValuesUser)

  if (isLoading) return <LoadingCustom />
  const handleChangeInfo = async (values: any, actions: any) => {
    const result = await updateInfo({ fullname: values.fullname, file })
    if (result) {
      //update lai fullname trong nextAuth -> update()
      await update({
        ...session,
        user: {
          ...session!.user,
          fullname: values.fullname,
        },
      })
      // Update avatar data in React Query cache
      client.setQueryData(['User Information'], result);
      toast.success('Change information successfully', {
        position: 'top-center',
      })
    }
  }

  const handleChangePassword = async (values: any, actions: any) => {
    const result = await updatePassword({
      password: values.oldPassword,
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
    <div className='box'>
      <p className='box__title'>My Account</p>
      {changePassword ? (
        <>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchemaInfoPassword}
            initialValues={initialValuesUserPassword}
            enableReinitialize={true}
            onSubmit={handleChangePassword}
          >
            {({ isSubmitting, errors, values, touched, handleChange }) => {
              const { oldPassword, newPassword, confirmPassword } = values
              return (
                <Form>
                  <div className='input-box'>
                    <label htmlFor='oldPassword'>Old Password</label>
                    <br />
                    <input
                      value={oldPassword}
                      role='presentation'
                      autoComplete='off'
                      type='password'
                      id='oldPassword'
                      placeholder='Enter your password'
                      onChange={handleChange}
                    />
                    <ErrorField touched={touched.oldPassword} error={errors.oldPassword} />
                  </div>
                  <div className='input-box'>
                    <label htmlFor='newPassword'>New Password</label>
                    <br />
                    <input
                      value={newPassword}
                      role='presentation'
                      placeholder='Re-type your password'
                      autoComplete='off'
                      type='password'
                      id='newPassword'
                      onChange={handleChange}
                    />
                    <ErrorField touched={touched.newPassword} error={errors.newPassword} />
                  </div>
                  <div className='input-box'>
                    <label htmlFor='confirmPassword'>Confirm New Password</label>
                    <br />
                    <input
                      value={confirmPassword}
                      role='presentation'
                      placeholder='Re-type your password'
                      autoComplete='off'
                      type='password'
                      id='confirmPassword'
                      onChange={handleChange}
                    />
                    <ErrorField touched={touched.confirmPassword} error={errors.confirmPassword} />
                  </div>
                  <button type='submit' className='btn-update'>
                    Update Password
                  </button>
                </Form>
              )
            }}
          </Formik>
        </>
      ) : (
        <>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchemaInfo}
            initialValues={getUserInfo()}
            enableReinitialize={true}
            onSubmit={handleChangeInfo}
          >
            {({ isSubmitting, errors, values, touched, handleChange }) => {
              const { fullname, email } = values
              return (
                <Form>
                  <p className='label-avatar'>Avatar</p>
                  <div className='preview-avatar'>
                    <label htmlFor='file-upload' className='custom-file-upload'>
                      <FontAwesomeIcon className='icon' icon={faUpload} />
                      Upload
                    </label>
                    <input id='file-upload' type='file' onChange={handleChangeImage} />
                    <Image 
                      style={{
                        borderRadius: '50%',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                      alt=''
                      width={100}
                      height={100}
                      src={file ? URL.createObjectURL(file) : userInfo && userInfo.avatar}
                    />
                    {file && (
                      <p className='clear-img' onClick={() => setFile('')}>
                        Clear image
                      </p>
                    )}
                  </div>

                  <div className='input-box'>
                    <label htmlFor='fullname'>Full Name</label>
                    <br />
                    <input
                      value={fullname}
                      role='presentation'
                      autoComplete='off'
                      type='text'
                      id='fullname'
                      onChange={handleChange}
                    />
                    <ErrorField touched={touched.fullname} error={errors.fullname} />
                  </div>
                  <div className='input-box'>
                    <label htmlFor='email'>Email</label>
                    <br />
                    <input
                      value={email}
                      readOnly
                      role='presentation'
                      autoComplete='off'
                      type='email'
                      id='email'
                      onChange={handleChange}
                    />
                  </div>
                  <button type='submit' disabled={isSubmitting} className='btn-update'>
                    Update Profile
                  </button>
                </Form>
              )
            }}
          </Formik>
        </>
      )}

      {changePassword ? (
        <p
          className='btn-text'
          onClick={e => {
            e.preventDefault()
            setChangePassword(false)
          }}
        >
          Go back to my information
        </p>
      ) : (
        <p
          className='btn-text'
          onClick={e => {
            e.preventDefault()
            setChangePassword(true)
          }}
        >
          Change Password
        </p>
      )}
      {/* </form> */}
    </div>
  )
}
