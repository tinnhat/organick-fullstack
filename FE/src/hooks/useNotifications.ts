// ============ FEATURE: notifications START ============
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { Notification } from '@/app/type.d'
import { toast } from 'sonner'

export const useNotifications = () => {
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    )
    socket?.emit('markNotificationAsRead', { notificationId: id })
  }, [socket])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    socket?.emit('markAllNotificationsAsRead')
  }, [socket])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    socket?.emit('deleteNotification', { notificationId: id })
  }, [socket])

  useEffect(() => {
    if (!socket) return

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
  }, [socket])

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
