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
  // Use ref to track the current socket instance to avoid stale closures
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const accessToken = session?.user?.access_token

    // If no access token, clean up any existing socket
    if (!accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Create new socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      // Timeout settings to prevent hanging
      timeout: 10000,
      // Auto reconnect settings
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    })

    // Store socket in ref
    socketRef.current = socketInstance

    const handleConnect = () => {
      console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error.message)
      setIsConnected(false)
      // Don't throw - handle gracefully
    }

    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.on('connect_error', handleConnectError)

    setSocket(socketInstance)

    // Cleanup function
    return () => {
      // Remove listeners first to prevent memory leaks
      socketInstance.off('connect', handleConnect)
      socketInstance.off('disconnect', handleDisconnect)
      socketInstance.off('connect_error', handleConnectError)
      
      // Safely disconnect the socket
      if (socketInstance.connected) {
        socketInstance.disconnect()
      }
      
      // Clear the ref
      if (socketRef.current === socketInstance) {
        socketRef.current = null
      }
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
