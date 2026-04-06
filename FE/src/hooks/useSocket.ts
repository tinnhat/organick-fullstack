// ============ FEATURE: websocket-chat START ============
'use client'
import { useSocketContext } from '@/contexts/SocketContext'
import { Socket } from 'socket.io-client'

export const useSocket = () => {
  const { socket, isConnected } = useSocketContext()

  return {
    socket: socket as Socket,
    isConnected,
  }
}

export default useSocket
// ============ FEATURE: websocket-chat END ============
