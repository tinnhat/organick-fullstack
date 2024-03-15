'use client'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
  setShowRegister: (value: boolean) => void
}

export default function LoginForm({ setShowRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (email && password) {
        const response = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        console.log(response)
        if (response?.error) {
          toast.error(response.error, {
            position: 'bottom-right',
          })
          return
        }
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
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
        <button disabled={isLoading} className={`btn-create-account ${isLoading ? 'loading' : ''}`}>Login</button>
      </form>
      <p className='box__text'>
        Don&apos;t have an account ?<span onClick={() => setShowRegister(true)}>Register Now</span>
      </p>
    </div>
  )
}
