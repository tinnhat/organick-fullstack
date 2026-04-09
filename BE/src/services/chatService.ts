import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { conversationModel } from '../models/conversationModel'
import { notificationService } from './notificationService'
import ApiError from '../utils/ApiError'
import { responseData } from '../utils/algorithms'

const getOrCreateConversation = async (userId: string) => {
  try {
    const conversationId = `user_${userId}_admin`
    let conversation = await conversationModel.findOneByConversationId(conversationId)

    if (!conversation) {
      const adminUser = await findAdminUser()
      const newConversation = {
        conversationId,
        participants: [
          { userId: new ObjectId(userId), role: 'user' as const },
          { userId: adminUser._id, role: 'admin' as const }
        ],
        messages: [],
        lastMessageAt: new Date()
      }
      const created = await conversationModel.createNew(newConversation)
      conversation = await conversationModel.findOneByConversationId(conversationId)
    }

    return conversation
  } catch (error) {
    throw error
  }
}

const findAdminUser = async () => {
  const { userModel } = await import('../models/userModel')
  const { users } = await userModel.getUsers()
  const admin = users.find((u: any) => u.isAdmin === true)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin user not found')
  }
  return admin
}

const getConversation = async (conversationId: string) => {
  try {
    const conversation = await conversationModel.findOneByConversationId(conversationId)
    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
    }
    return conversation
  } catch (error) {
    throw error
  }
}

const getUserConversations = async (userId: string) => {
  try {
    const conversations = await conversationModel.findByUserId(userId)
    return responseData(conversations)
  } catch (error) {
    throw error
  }
}

const getAdminConversations = async () => {
  try {
    const conversations = await conversationModel.findAll()
    return responseData(conversations)
  } catch (error) {
    throw error
  }
}

const addMessage = async (conversationId: string, senderId: string, content: string) => {
  try {
    if (!content || content.trim() === '') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Message content cannot be empty')
    }

    const conversation = await conversationModel.findOneByConversationId(conversationId)
    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
    }

    const participant = conversation.participants.find(
      (p: any) => p.userId.toString() === senderId
    )
    if (!participant) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is not a participant in this conversation')
    }

    const message = {
      _id: new ObjectId(),
      senderId: new ObjectId(senderId),
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
      isDeleted: false
    }

    const updated = await conversationModel.addMessage(conversationId, message)

    const recipient = conversation.participants.find(
      (p: any) => p.userId.toString() !== senderId
    )

    if (recipient) {
      await notificationService.createNotification(
        recipient.userId.toString(),
        'chat',
        'New Message',
        content.substring(0, 100),
        { senderId, conversationId }
      )
    }

    return message
  } catch (error) {
    throw error
  }
}

const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    const conversation = await conversationModel.findOneByConversationId(conversationId)
    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
    }

    const result = await conversationModel.markMessagesAsRead(conversationId, userId)
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const deleteMessage = async (conversationId: string, messageId: string, userId: string) => {
  try {
    const conversation = await conversationModel.findOneByConversationId(conversationId)
    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
    }

    const result = await conversationModel.deleteMessage(conversationId, messageId, userId)
    if (!result) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only delete your own messages')
    }
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const getUnreadCount = async (userId: string) => {
  try {
    const count = await conversationModel.getUnreadCountByUser(userId)
    return responseData({ unreadCount: count })
  } catch (error) {
    throw error
  }
}

export const chatService = {
  getOrCreateConversation,
  getConversation,
  getUserConversations,
  getAdminConversations,
  addMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount
}
