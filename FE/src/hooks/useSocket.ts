// ============ FEATURE: websocket-chat START ============
'use client'
import { useSocketContext } from '@/contexts/SocketContext'
import { Socket } from 'socket.io-client'

export const useSocket = () => {
  const { socket, isConnected } = useSocketContext()

  // Return socket as Socket | null to properly indicate it might be null
  // Components should check if socket exists before using it
  return {
    socket: socket as Socket | null,
    isConnected,
  }
}

export default useSocket
// ============ FEATURE: websocket-chat END ============
