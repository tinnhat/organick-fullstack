import React from 'react'
import './style.scss'
type Props = {}

export default function MyAccount({}: Props) {
  return (
    <div className='my-account'>
      <div className='container'>
        <div className='my-account-container'>
          <div className='box'>
            <p className='box__title'>My Account</p>
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
                <input role='presentation' autoComplete='off' type='email' id='email' placeholder='Enter your email' />
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
                <label htmlFor='rePassword'>New Password</label>
                <br />
                <input
                  role='presentation'
                  placeholder='Re-type your password'
                  autoComplete='off'
                  type='password'
                  id='rePassword'
                />
              </div>
              <div className='input-box'>
                <label htmlFor='rePassword'>Confirm New Password</label>
                <br />
                <input
                  role='presentation'
                  placeholder='Re-type your password'
                  autoComplete='off'
                  type='password'
                  id='rePassword'
                />
              </div>
              <button className='btn-update'>Update Profile</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
