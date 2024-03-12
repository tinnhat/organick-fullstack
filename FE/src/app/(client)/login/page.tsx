'use client'
import React, { useState } from 'react'
import './style.scss'
import Image from 'next/image'
type Props = {}

export default function AuthPage({}: Props) {
  const [showRegister, setShowRegister] = useState(false)
  return (
    <div className='auth-page'>
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
              <form action=''>
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
                  <input role='presentation' placeholder='Re-type your password' autoComplete='off' type='password' id='rePassword' />
                </div>
                <button className='btn-create-account'>Create Account</button>
              </form>
              <p className='box__text'>
                Already have an account? <span onClick={() => setShowRegister(false)}>Log in</span>
              </p>
            </div>
          ) : (
            <div className='box'>
              <p className='box__title mb-0 title'>Welcome to Organick</p>
              <p className='box__title'>Login</p>
              <form action=''>
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

                <button className='btn-create-account'>Login</button>
              </form>
              <p className='box__text'>
                Don&apos;t have an account ?<span onClick={() => setShowRegister(true)}>Register Now</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
