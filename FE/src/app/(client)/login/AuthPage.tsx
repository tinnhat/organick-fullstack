'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import LoginForm from './loginForm'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RegisterForm from './registerForm'



export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className='container'>
      <div className='auth-container'>
        <div className='bkg-login-img'>
          <Image
            src='/assets/img/bkgLogin.webp'
            alt=''
            width={0}
            height={0}
            priority
            sizes='100vw'
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%'
            }}
          />
        </div>
        {showRegister ? (
          <RegisterForm setShowRegister={setShowRegister} />
        ) : (
          <LoginForm setShowRegister={setShowRegister} />
        )}
      </div>
    </div>
  )
}
