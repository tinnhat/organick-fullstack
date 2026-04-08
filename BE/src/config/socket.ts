import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'
import { env } from './environment'
import { chatService } from '../services/chatService'

interface OnlineUser {
  socketIds: Set<string>
  userId: string
  isAdmin: boolean
}

const onlineUsers: Map<string, OnlineUser> = new Map()

const getOnlineUsersList = () => {
  const users: Array<{ userId: string; isAdmin: boolean }> = []
  onlineUsers.forEach((user) => {
    users.push({ userId: user.userId, isAdmin: user.isAdmin })
  })
  return users
}

const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, env.JWT_SECRET!) as any
      socket.user = {
        _id: decoded._id,
        fullname: decoded.fullname,
        email: decoded.email,
        isAdmin: decoded.isAdmin
      }
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: any) => {
    const userId = socket.user._id
    const isAdmin = socket.user.isAdmin

    const existingUser = onlineUsers.get(userId)
    if (existingUser) {
      existingUser.socketIds.add(socket.id)
    } else {
      onlineUsers.set(userId, {
        socketIds: new Set([socket.id]),
        userId,
        isAdmin
      })
    }

    socket.join(`user_${userId}`)

    if (isAdmin) {
      socket.join('admin_room')
    }

    socket.emit('connected', { userId, socketId: socket.id })

    io.emit('user_online', { userId, isAdmin })

    socket.on('join_room', (data: { conversationId?: string }) => {
      if (data.conversationId) {
        socket.join(`conversation_${data.conversationId}`)
      }
      socket.join(`user_${userId}`)
    })

    socket.on('leave_room', (data: { conversationId?: string }) => {
      if (data.conversationId) {
        socket.leave(`conversation_${data.conversationId}`)
      }
      socket.leave(`user_${userId}`)
    })

    socket.on('send_message', async (data: { conversationId: string; content: string }) => {
      try {
        if (!data.content || data.content.trim() === '') {
          socket.emit('error', { message: 'Message content cannot be empty' })
          return
        }

        const message = await chatService.addMessage(data.conversationId, userId, data.content)

        const conversation = await chatService.getConversation(data.conversationId)
        if (conversation) {
          const recipient = conversation.participants.find(
            (p: any) => p.userId.toString() !== userId
          )

          socket.emit('receive_message', {
            message,
            conversationId: data.conversationId
          })

          if (recipient) {
            io.to(`user_${recipient.userId}`).emit('receive_message', {
              message,
              conversationId: data.conversationId,
              senderId: userId
            })

            io.to(`user_${recipient.userId}`).emit('new_message_notification', {
              message,
              conversationId: data.conversationId,
              senderId: userId,
              senderName: socket.user.fullname
            })
          }

          io.to('admin_room').emit('message_sent', {
            message,
            conversationId: data.conversationId,
            senderId: userId
          })
        }
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Failed to send message' })
      }
    })

    socket.on('typing', (data: { conversationId: string; recipientId: string }) => {
      io.to(`user_${data.recipientId}`).emit('typing', {
        conversationId: data.conversationId,
        userId,
        userName: socket.user.fullname
      })
    })

    socket.on('stop_typing', (data: { conversationId: string; recipientId: string }) => {
      io.to(`user_${data.recipientId}`).emit('stop_typing', {
        conversationId: data.conversationId,
        userId
      })
    })

    socket.on('get_online_users', () => {
      if (socket.user.isAdmin) {
        socket.emit('online_users_list', { users: getOnlineUsersList() })
      }
    })

    socket.on('mark_as_read', async (data: { conversationId: string }) => {
      try {
        await chatService.markMessagesAsRead(data.conversationId, userId)
        socket.emit('messages_marked_read', { conversationId: data.conversationId })
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Failed to mark messages as read' })
      }
    })

    socket.on('disconnect', () => {
      const user = onlineUsers.get(userId)
      if (user) {
        user.socketIds.delete(socket.id)
        if (user.socketIds.size === 0) {
          onlineUsers.delete(userId)
          io.emit('user_offline', { userId, isAdmin })
        }
      }
    })
  })

  return io
}

export { initializeSocket, onlineUsers }
