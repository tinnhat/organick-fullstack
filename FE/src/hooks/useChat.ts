// ============ FEATURE: websocket-chat START ============
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { useSession } from 'next-auth/react'
import { Message } from '@/app/type.d'

export const useChat = (targetUserId?: string) => {
  const { socket, isConnected } = useSocket()
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !session?.user?._id || !targetUserId) return

      socket.emit('sendMessage', {
        senderId: session.user._id,
        receiverId: targetUserId,
        content,
      })
    },
    [socket, session?.user?._id, targetUserId]
  )

  const setTyping = useCallback(
    (typing: boolean) => {
      if (!socket || !session?.user?._id || !targetUserId) return

      socket.emit('typing', {
        userId: session.user._id,
        targetUserId,
        isTyping: typing,
      })
    },
    [socket, session?.user?._id, targetUserId]
  )

  const markAsRead = useCallback(() => {
    if (!socket || !session?.user?._id || !targetUserId) return

    socket.emit('markAsRead', {
      userId: session.user._id,
      targetUserId,
    })
  }, [socket, session?.user?._id, targetUserId])

  useEffect(() => {
    if (!socket || !session?.user?._id || !targetUserId) return

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message])
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

    socket.emit('getMessages', {
      userId: session.user._id,
      targetUserId,
    })

    socket.on('messagesHistory', handleMessagesHistory)
    socket.on('newMessage', handleNewMessage)
    socket.on('typing', handleTyping)

    return () => {
      socket.off('messagesHistory', handleMessagesHistory)
      socket.off('newMessage', handleNewMessage)
      socket.off('typing', handleTyping)
    }
  }, [socket, session?.user?._id, targetUserId])

  return {
    messages,
    sendMessage,
    isTyping,
    typingUser,
    setTyping,
    markAsRead,
    isConnected,
  }
}

export default useChat
// ============ FEATURE: websocket-chat END ============
