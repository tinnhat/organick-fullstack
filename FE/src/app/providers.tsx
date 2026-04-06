// ============ FEATURE: websocket-chat START ============
'use client'
import { SessionProvider } from 'next-auth/react'
import { SocketProvider } from '@/contexts/SocketContext'

export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      <SocketProvider>{children}</SocketProvider>
    </SessionProvider>
  )
}
// ============ FEATURE: websocket-chat END ============
