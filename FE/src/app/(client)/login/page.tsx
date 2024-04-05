'use client'
import LoadingCustom from '@/app/components/loading'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthPage from './AuthPage'
import './style.scss'

export default function Login() {
  const [isLoading, setIsLoading] = useState(true)
  const route = useRouter()
  useEffect(() => {
    const getSessionAsync = async () => {
      const session = await getSession()
      return session
    }
    getSessionAsync()
      .then(session => {
        if (session) {
          route.push('/home')
        } else {
          setIsLoading(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [route])

  return <div className='auth-page'>{isLoading ? <LoadingCustom /> : <AuthPage />}</div>
}
