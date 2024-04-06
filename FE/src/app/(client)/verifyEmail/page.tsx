'use client'
import LoadingCustom from '@/app/components/loading'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import './style.scss'

export default function VerifyEmail() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailToken = searchParams.get('emailToken')
  useEffect(() => {
    ;(async () => {
      // wrong route
      if (!emailToken) return router.push('/')
      // already login  => redirect to home
      if (session) {
        return router.push('/home')
      }
      const res = await fetch(`${process.env.HOST_BE}/users/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailToken }),
      })
      const result = await res.json()
      if (result.success) {
        setUser(result.data)
        setTimeout(() => {
          router.push('/login')
        }, 5000)
      } else if (result.statusCode === 500) {
        setIsError(true)
      }
      setIsLoading(false)
    })()
  }, [emailToken])

  return (
    <div className='verify-page'>
      {isLoading ? (
        <LoadingCustom />
      ) : (
        <div className='container'>
          <div className='verify-container'>
            {user ? (
              <div className='verify-box'>
                <p className='verify-box__title'>Your email has been verified</p>
                <p className='verify-box__desc'>Thank you for being with us</p>
                <p className='verify-box__desc'>
                  We will redirect you to login page, Please wait 5s... Or you can click the button
                </p>
                <button className='btn-go-login' onClick={() => router.push('/login')}>
                  Go to login
                </button>
              </div>
            ) : (
              <div className='verify-box'>
                {isError ? (
                  <>
                    <p className='verify-box__title'>Email verification failed</p>
                    <p className='verify-box__desc'>Please try again</p>
                  </>
                ) : (
                  <>
                    <p className='verify-box__title'>Email verification failed</p>
                    <p className='verify-box__desc'>Please check your email and try email</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
