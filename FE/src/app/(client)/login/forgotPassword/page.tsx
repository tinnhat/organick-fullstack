'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import '../style.scss'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Failed to send reset email', {
          position: 'bottom-right'
        })
        return
      }
      setIsSuccess(true)
      toast.success('Reset password email sent successfully! Check your email.', {
        position: 'bottom-right'
      })
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'bottom-right'
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className='box'>
          <p className='box__title mb-0 title'>Organick</p>
          <p className='box__title'>Forgot Password</p>
          {isSuccess ? (
            <div className='success-message'>
              <p>We have sent a password reset link to your email.</p>
              <p>Please check your inbox and click the link to reset your password.</p>
              <Link href='/login' className='btn-back'>Back to Login</Link>
            </div>
          ) : (
            <>
              <p className='box__desc'>Enter your email address and we will send you a link to reset your password.</p>
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
                <button disabled={isLoading} className={`btn-create-account ${isLoading ? 'loading' : ''}`}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className='box__text'>
                Remember your password?<Link href='/login'>Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}