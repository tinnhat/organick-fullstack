'use client'
import React, { useState } from 'react'
type Props = {
  setShowRegister: (value: boolean) => void
}

export default function LoginForm({ setShowRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email && password) {
      const res = await fetch('http://localhost:8017/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const result = await res.json()
      console.log(result)
    }
  }
  return (
    <div className='box'>
      <p className='box__title mb-0 title'>Welcome to Organick</p>
      <p className='box__title'>Login</p>
      <form onSubmit={handleSubmit}>
        <div className='input-box'>
          <label htmlFor='email'>Email</label>
          <br />
          <input
            role='presentation'
            autoComplete='off'
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button className='btn-create-account'>Login</button>
      </form>
      <p className='box__text'>
        Don&apos;t have an account ?<span onClick={() => setShowRegister(true)}>Register Now</span>
      </p>
    </div>
  )
}
