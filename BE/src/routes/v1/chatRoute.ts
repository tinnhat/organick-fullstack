import express from 'express'
import { Auth } from '../../middlewares/authMiddleware'
import { AdminAuth } from '../../middlewares/adminMiddleware'
import { chatController } from '../../controllers/chatController'

const Router = express.Router()

Router.get('/history', Auth, chatController.getUserConversations)

Router.get('/history/:userId', Auth, AdminAuth, chatController.getConversationByUserId)

Router.get('/conversation/:conversationId', Auth, chatController.getConversation)

Router.delete('/message/:messageId', Auth, chatController.deleteMessage)

Router.get('/unread-count', Auth, chatController.getUnreadCount)

export const chatRoute = Router
