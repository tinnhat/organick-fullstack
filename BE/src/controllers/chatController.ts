import { StatusCodes } from 'http-status-codes'
import { chatService } from '../services/chatService'
import ApiError from '../utils/ApiError'

/* eslint-disable no-useless-catch */
const getUserConversations = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await chatService.getUserConversations(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAdminConversations = async (req: any, res: any, next: any) => {
  try {
    const result = await chatService.getAdminConversations()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getConversationByUserId = async (req: any, res: any, next: any) => {
  try {
    const { userId } = req.params
    const conversation = await chatService.getOrCreateConversation(userId)
    res.status(StatusCodes.OK).json({ success: true, data: conversation })
  } catch (error) {
    next(error)
  }
}

const getConversation = async (req: any, res: any, next: any) => {
  try {
    const { conversationId } = req.params
    const conversation = await chatService.getConversation(conversationId)
    res.status(StatusCodes.OK).json({ success: true, data: conversation })
  } catch (error) {
    next(error)
  }
}

const deleteMessage = async (req: any, res: any, next: any) => {
  try {
    const { messageId } = req.params
    const { conversationId } = req.body
    const userId = req.user._id.toString()

    if (!conversationId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Conversation ID is required')
    }

    const result = await chatService.deleteMessage(conversationId, messageId, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getUnreadCount = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await chatService.getUnreadCount(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const chatController = {
  getUserConversations,
  getAdminConversations,
  getConversationByUserId,
  getConversation,
  deleteMessage,
  getUnreadCount
}
