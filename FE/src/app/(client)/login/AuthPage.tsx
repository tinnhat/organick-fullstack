'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import LoginForm from './loginForm'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {}

export default function AuthPage({}: Props) {
  const [showRegister, setShowRegister] = useState(false)
  const [file, setFile] = useState<any>()
  const handleChange = (e: any) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // setFile(selectedFile)
      const fileUrl = URL.createObjectURL(selectedFile)
      setFile(fileUrl)
      // Use fileUrl as needed
    }
  }
  return (
    <div className='container'>
      <div className='auth-container'>
        <div className='bkg-login-img'>
          <Image
            src='/assets/img/bkgLogin.png'
            alt=''
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>
        {showRegister ? (
          <div className='box'>
            <p className='box__title'>Create your Account</p>
            <form>
              {/* <p className='label-avatar'>Avatar</p> */}
              <div className='preview-avatar'>
                <label htmlFor='file-upload' className='custom-file-upload'>
                  <FontAwesomeIcon className='icon' icon={faUpload} />
                  Upload
                </label>
                <input id='file-upload' type='file' onChange={handleChange} />
                <Image
                  style={{
                    borderRadius: '50%',
                    marginTop: '5px',
                    marginBottom: '5px',
                  }}
                  alt='Avatar'
                  width={100}
                  height={100}
                  src={file ? file : '/images/users/avatar-default.jpg'}
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
                  role='presentation'
                  autoComplete='off'
                  type='text'
                  id='fullname'
                  placeholder='Enter your full name'
                />
              </div>
              <div className='input-box'>
                <label htmlFor='email'>Email</label>
                <br />
                <input
                  role='presentation'
                  autoComplete='off'
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                />
              </div>
              <div className='input-box'>
                <label htmlFor='password'>Password</label>
                <br />
                <input
                  role='presentation'
                  autoComplete='off'
                  type='password'
                  id='password'
                  placeholder='Enter your password'
                />
              </div>
              <div className='input-box'>
                <label htmlFor='rePassword'>Re-Password</label>
                <br />
                <input
                  role='presentation'
                  placeholder='Re-type your password'
                  autoComplete='off'
                  type='password'
                  id='rePassword'
                />
              </div>
              <button className='btn-create-account'>Create Account</button>
            </form>
            <p className='box__text'>
              Already have an account? <span onClick={() => setShowRegister(false)}>Log in</span>
            </p>
          </div>
        ) : (
          <LoginForm setShowRegister={setShowRegister} />
        )}
      </div>
    </div>
  )
}
