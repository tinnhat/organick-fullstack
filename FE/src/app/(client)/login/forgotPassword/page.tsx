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
  const [generatedPassword, setGeneratedPassword] = useState('')

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
        toast.error(data.message || 'Failed to reset password', {
          position: 'bottom-right'
        })
        return
      }
      setIsSuccess(true)
      setGeneratedPassword(data.data.password)
      toast.success('Password has been reset!', {
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
              <p>Your password has been reset!</p>
              <p>Your new temporary password:</p>
              <div className='generated-password'>{generatedPassword}</div>
              <p className='note'>Please copy this password and login with it. You can change your password after logging in.</p>
              <Link href='/login' className='btn-back'>Back to Login</Link>
            </div>
          ) : (
            <>
              <p className='box__desc'>Enter your email address and we will generate a new password for you.</p>
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
                  {isLoading ? 'Generating...' : 'Generate New Password'}
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