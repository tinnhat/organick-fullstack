'use client'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthPage from './AuthPage'
import './style.scss'
import LoadingCustom from '@/app/components/loading'

type Props = {}

export default function Login({}: Props) {
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
