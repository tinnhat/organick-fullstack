'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import LoginForm from './loginForm'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RegisterForm from './registerForm'

type Props = {}

export default function AuthPage({}: Props) {
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
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
            priority
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
