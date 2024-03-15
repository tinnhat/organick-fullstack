import React from 'react'
import './style.scss'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AuthPage from './AuthPage'
type Props = {}

export default async function Login({}: Props) {
  const session = await getServerSession(authOptions)
  if (session) redirect('/home')

  return (
    <div className='auth-page'>
      <AuthPage />
    </div>
  )
}
