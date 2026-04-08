// ============ FEATURE: websocket-chat START ============
'use client'
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocketContext = () => useContext(SocketContext)

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()
  const listenersRef = useRef(0)

  useEffect(() => {
    if (!session?.user?.access_token) return

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: session.user.access_token,
      },
      transports: ['websocket', 'polling'],
    })

    const handleConnect = () => {
      console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    }

    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.on('connect_error', handleConnectError)
    listenersRef.current += 3

    setSocket(socketInstance)

    return () => {
      socketInstance.off('connect', handleConnect)
      socketInstance.off('disconnect', handleDisconnect)
      socketInstance.off('connect_error', handleConnectError)
      listenersRef.current -= 3
      socketInstance.disconnect()
    }
  }, [session?.user?.access_token])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
// ============ FEATURE: websocket-chat END ============
