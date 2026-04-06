// ============ FEATURE: websocket-chat START ============
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'

export const useOnlineStatus = () => {
  const { socket, isConnected } = useSocket()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const isOnline = useCallback(
    (userId: string) => {
      return onlineUsers.includes(userId)
    },
    [onlineUsers]
  )

  useEffect(() => {
    if (!socket) return

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users)
    }

    const handleUserOnline = (userId: string) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]))
    }

    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId))
    }

    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('userOnline', handleUserOnline)
    socket.on('userOffline', handleUserOffline)

    return () => {
      socket.off('onlineUsers', handleOnlineUsers)
      socket.off('userOnline', handleUserOnline)
      socket.off('userOffline', handleUserOffline)
    }
  }, [socket])

  return {
    onlineUsers,
    isOnline,
  }
}

export default useOnlineStatus
// ============ FEATURE: websocket-chat END ============
