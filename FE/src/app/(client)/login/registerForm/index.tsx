import ErrorField from '@/app/components/errorField'
import { useRegisterMutation } from '@/app/utils/hooks/usersHooks'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, Formik } from 'formik'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'

type Props = {
  setShowRegister: (value: boolean) => void
}

type Info = {
  email: string
  fullname: string
  password: string
  confirmPassword: string
}

const validationSchema = yup.object({
  fullname: yup
    .string()
    .required('Name is required')
    .min(4, 'Name should be of minimum 4 characters length'),
  email: yup.string().required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
})
export default function RegisterForm({ setShowRegister }: Props) {
  const initialValues: Info = { email: '', fullname: '', password: '', confirmPassword: '' }
  const { mutateAsync: register } = useRegisterMutation()
  const [file, setFile] = useState<any>()
  const handleChangeImage = (e: any) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const handleSubmitForm = async (values: any, actions: any) => {
    const result = await register({ ...values, file })
    if (result) {
      actions.resetForm()
      setShowRegister(false)
      toast.info('Please check your email to activate your account', {
        position: 'bottom-right',
      })
    }
  }

  return (
    <div className='box'>
      <p className='box__title'>Create your Account</p>
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
      >
        {({ isSubmitting, errors, values, touched, handleChange }) => {
          const { email, fullname, password, confirmPassword } = values
          return (
            <Form>
              <div className='preview-avatar'>
                <label htmlFor='file-upload' className='custom-file-upload'>
                  <FontAwesomeIcon className='icon' icon={faUpload} />
                  Upload
                </label>
                <input id='file-upload' type='file' onChange={handleChangeImage} />
                <Image
                  alt='Avatar'
                  width={100}
                  height={100}
                  src={file ? URL.createObjectURL(file) : '/images/users/avatar-default.webp'}
                  style={{
                    borderRadius: '50%',
                    marginTop: '5px',
                    marginBottom: '5px',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
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
                  onChange={handleChange}
                  role='presentation'
                  autoComplete='off'
                  type='text'
                  id='fullname'
                  placeholder='Enter your full name'
                />
                <ErrorField touched={touched.fullname} error={errors.fullname} />
              </div>
              <div className='input-box'>
                <label htmlFor='email'>Email</label>
                <br />
                <input
                  value={email}
                  onChange={handleChange}
                  role='presentation'
                  autoComplete='off'
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                />
                <ErrorField touched={touched.email} error={errors.email} />
              </div>
              <div className='input-box'>
                <label htmlFor='password'>Password</label>
                <br />
                <input
                  value={password}
                  onChange={handleChange}
                  role='presentation'
                  autoComplete='off'
                  type='password'
                  id='password'
                  placeholder='Enter your password'
                />
                <ErrorField touched={touched.password} error={errors.password} />
              </div>
              <div className='input-box'>
                <label htmlFor='rePassword'>Re-Password</label>
                <br />
                <input
                  value={confirmPassword}
                  onChange={handleChange}
                  role='presentation'
                  placeholder='Re-type your password'
                  autoComplete='off'
                  type='password'
                  id='confirmPassword'
                />
                <ErrorField touched={touched.confirmPassword} error={errors.confirmPassword} />
              </div>
              <button disabled={isSubmitting} type='submit' className='btn-create-account'>
                Create Account
              </button>
            </Form>
          )
        }}
      </Formik>
      <p className='box__text'>
        Already have an account? <span onClick={() => setShowRegister(false)}>Log in</span>
      </p>
    </div>
  )
}
