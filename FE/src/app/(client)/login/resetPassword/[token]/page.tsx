'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import '../../style.scss'

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/reset-password-with-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword: password })
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Failed to reset password', {
          position: 'bottom-right'
        })
        return
      }
      setIsSuccess(true)
      toast.success('Password reset successfully! Redirecting to login...', {
        position: 'bottom-right'
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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
          <p className='box__title'>Reset Password</p>
          {isSuccess ? (
            <div className='success-message'>
              <p>Your password has been reset successfully!</p>
              <p>Redirecting you to login page...</p>
            </div>
          ) : (
            <>
              <p className='box__desc'>Enter your new password below.</p>
              <form onSubmit={handleSubmit}>
                <div className='input-box'>
                  <label htmlFor='password'>New Password</label>
                  <br />
                  <input
                    role='presentation'
                    autoComplete='off'
                    type='password'
                    id='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Enter your new password'
                    required
                  />
                </div>
                <div className='input-box'>
                  <label htmlFor='confirmPassword'>Confirm Password</label>
                  <br />
                  <input
                    role='presentation'
                    autoComplete='off'
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder='Confirm your new password'
                    required
                  />
                </div>
                {error && <p className='error-message'>{error}</p>}
                <button disabled={isLoading} className={`btn-create-account ${isLoading ? 'loading' : ''}`}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
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