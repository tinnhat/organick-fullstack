// ============ FEATURE: notifications START ============
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { Notification } from '@/app/type.d'
import { toast } from 'sonner'

export const useNotifications = () => {
  const { socket, isConnected } = useSocket() as { socket: any; isConnected: boolean }
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    )
    // Only emit if socket exists and is connected
    if (socket && isConnected) {
      socket.emit('markNotificationAsRead', { notificationId: id })
    }
  }, [socket, isConnected])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    // Only emit if socket exists and is connected
    if (socket && isConnected) {
      socket.emit('markAllNotificationsAsRead')
    }
  }, [socket, isConnected])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    // Only emit if socket exists and is connected
    if (socket && isConnected) {
      socket.emit('deleteNotification', { notificationId: id })
    }
  }, [socket, isConnected])

  useEffect(() => {
    // Don't run if socket doesn't exist or isn't connected
    if (!socket || !isConnected) return

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      toast(notification.title, {
        description: notification.message,
        action: notification.relatedId ? {
          label: 'View',
          onClick: () => {
            if (notification.type === 'order') {
              window.location.href = `/admin/orders/${notification.relatedId}`
            } else if (notification.type === 'chat') {
              window.location.href = '/admin/chat'
            }
          },
        } : undefined,
      })
    }

    const handleNotificationsList = (list: Notification[]) => {
      setNotifications(list)
      setIsLoading(false)
    }

    socket.emit('getNotifications')
    setIsLoading(true)

    socket.on('notification', handleNewNotification)
    socket.on('notificationsList', handleNotificationsList)

    return () => {
      socket.off('notification', handleNewNotification)
      socket.off('notificationsList', handleNotificationsList)
    }
  }, [socket, isConnected])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
  }
}

export default useNotifications
// ============ FEATURE: notifications END ============
