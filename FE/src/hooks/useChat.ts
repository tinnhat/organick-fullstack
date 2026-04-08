// ============ FEATURE: websocket-chat START ============
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from './useSocket'
import { useSession } from 'next-auth/react'
import { Message } from '@/app/type.d'
import { SOCKET_EVENTS } from '@/lib/socketEvents'

export const useChat = (targetUserId?: string) => {
  const { socket, isConnected } = useSocket()
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const pendingMessageIds = useRef<Set<string>>(new Set())

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !session?.user?._id || !targetUserId) return

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const optimisticMessage: Message = {
        _id: tempId,
        senderId: session.user._id,
        receiverId: targetUserId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, optimisticMessage])
      pendingMessageIds.current.add(tempId)

      socket.emit(SOCKET_EVENTS.CLIENT.SEND_MESSAGE, {
        senderId: session.user._id,
        receiverId: targetUserId,
        content,
        tempId,
      })
    },
    [socket, session?.user?._id, targetUserId]
  )

  const setTyping = useCallback(
    (typing: boolean) => {
      if (!socket || !session?.user?._id || !targetUserId) return

      socket.emit(SOCKET_EVENTS.CLIENT.TYPING, {
        userId: session.user._id,
        targetUserId,
        isTyping: typing,
      })
    },
    [socket, session?.user?._id, targetUserId]
  )

  const markAsRead = useCallback(() => {
    if (!socket || !session?.user?._id || !targetUserId) return

    socket.emit(SOCKET_EVENTS.CLIENT.MARK_AS_READ, {
      userId: session.user._id,
      targetUserId,
    })
  }, [socket, session?.user?._id, targetUserId])

  const deleteMessage = useCallback(
    (messageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
      if (socket) {
        socket.emit(SOCKET_EVENTS.CLIENT.DELETE_MESSAGE, { messageId })
      }
    },
    [socket]
  )

  useEffect(() => {
    if (!socket || !session?.user?._id || !targetUserId) return

    setMessages([])
    pendingMessageIds.current.clear()

    const handleNewMessage = (message: Message & { tempId?: string }) => {
      if (message.tempId && pendingMessageIds.current.has(message.tempId)) {
        pendingMessageIds.current.delete(message.tempId)
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg._id !== message.tempId)
          return [...filtered, message]
        })
      } else if (!pendingMessageIds.current.has(message._id)) {
        setMessages((prev) => [...prev, message])
      }
    }

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === targetUserId) {
        setTypingUser(data.isTyping ? data.userId : null)
        setIsTyping(data.isTyping)
      }
    }

    const handleMessagesHistory = (history: Message[]) => {
      setMessages(history)
    }

    socket.emit(SOCKET_EVENTS.CLIENT.GET_MESSAGES, {
      userId: session.user._id,
      targetUserId,
    })

    socket.on(SOCKET_EVENTS.SERVER.MESSAGES_HISTORY, handleMessagesHistory)
    socket.on(SOCKET_EVENTS.SERVER.NEW_MESSAGE, handleNewMessage)
    socket.on(SOCKET_EVENTS.SERVER.TYPING, handleTyping)

    return () => {
      socket.off(SOCKET_EVENTS.SERVER.MESSAGES_HISTORY, handleMessagesHistory)
      socket.off(SOCKET_EVENTS.SERVER.NEW_MESSAGE, handleNewMessage)
      socket.off(SOCKET_EVENTS.SERVER.TYPING, handleTyping)
    }
  }, [socket, session?.user?._id, targetUserId])

  return {
    messages,
    sendMessage,
    isTyping,
    typingUser,
    setTyping,
    markAsRead,
    deleteMessage,
    isConnected,
  }
}

export default useChat
// ============ FEATURE: websocket-chat END ============
