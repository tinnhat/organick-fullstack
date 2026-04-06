import request from 'supertest'
import express from 'express'

jest.mock('../../services/chatService', () => ({
  chatService: {
    getOrCreateConversation: jest.fn(),
    getConversation: jest.fn(),
    getUserConversations: jest.fn(),
    getAdminConversations: jest.fn(),
    addMessage: jest.fn(),
    markMessagesAsRead: jest.fn(),
    deleteMessage: jest.fn(),
    getUnreadCount: jest.fn()
  }
}))

jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
}))

const mockChatService = require('../../services/chatService').chatService

const createApp = () => {
  const app = express()
  app.use(express.json())
  
  app.get('/api/chat/conversation/:conversationId', async (req, res) => {
    try {
      const result = await mockChatService.getConversation(req.params.conversationId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/chat/user/:userId', async (req, res) => {
    try {
      const result = await mockChatService.getUserConversations(req.params.userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/chat/admin', async (req, res) => {
    try {
      const result = await mockChatService.getAdminConversations()
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.post('/api/chat/message', async (req, res) => {
    try {
      const { conversationId, senderId, content } = req.body
      const result = await mockChatService.addMessage(conversationId, senderId, content)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.put('/api/chat/:conversationId/read', async (req, res) => {
    try {
      const { userId } = req.body
      const result = await mockChatService.markMessagesAsRead(req.params.conversationId, userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.delete('/api/chat/:conversationId/message/:messageId', async (req, res) => {
    try {
      const { userId } = req.body
      const result = await mockChatService.deleteMessage(req.params.conversationId, req.params.messageId, userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/chat/unread/:userId', async (req, res) => {
    try {
      const result = await mockChatService.getUnreadCount(req.params.userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return app
}

describe('Chat API Routes', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    app = createApp()
  })

  describe('GET /api/chat/conversation/:conversationId', () => {
    it('should return conversation by id', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId: 'user_user123_admin',
        messages: []
      }

      mockChatService.getConversation.mockResolvedValue({ data: conversation })

      const response = await request(app)
        .get('/api/chat/conversation/user_user123_admin')
        .expect(200)

      expect(response.body.data.conversationId).toBe('user_user123_admin')
    })

    it('should return 404 for non-existent conversation', async () => {
      mockChatService.getConversation.mockRejectedValue({
        statusCode: 404,
        message: 'Conversation not found'
      })

      await request(app)
        .get('/api/chat/conversation/nonexistent')
        .expect(404)
    })
  })

  describe('GET /api/chat/user/:userId', () => {
    it('should return user conversations', async () => {
      const conversations = [
        { _id: 'c1', conversationId: 'user_user123_admin' },
        { _id: 'c2', conversationId: 'user_user456_admin' }
      ]

      mockChatService.getUserConversations.mockResolvedValue({ data: conversations })

      const response = await request(app)
        .get('/api/chat/user/user123')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
    })
  })

  describe('GET /api/chat/admin', () => {
    it('should return admin conversations', async () => {
      const conversations = [
        { _id: 'c1', conversationId: 'user_user123_admin' },
        { _id: 'c2', conversationId: 'user_user456_admin' }
      ]

      mockChatService.getAdminConversations.mockResolvedValue({ data: conversations })

      const response = await request(app)
        .get('/api/chat/admin')
        .expect(200)

      expect(response.body.data).toHaveLength(2)
    })
  })

  describe('POST /api/chat/message', () => {
    it('should add message to conversation', async () => {
      const message = {
        _id: 'msg123',
        senderId: 'user123',
        content: 'Hello, I need help',
        timestamp: new Date()
      }

      mockChatService.addMessage.mockResolvedValue({ data: message })

      const response = await request(app)
        .post('/api/chat/message')
        .send({
          conversationId: 'user_user123_admin',
          senderId: 'user123',
          content: 'Hello, I need help'
        })
        .expect(201)

      expect(response.body.data.content).toBe('Hello, I need help')
    })

    it('should return error for empty message', async () => {
      mockChatService.addMessage.mockRejectedValue({
        statusCode: 400,
        message: 'Message content cannot be empty'
      })

      await request(app)
        .post('/api/chat/message')
        .send({
          conversationId: 'user_user123_admin',
          senderId: 'user123',
          content: ''
        })
        .expect(400)
    })
  })

  describe('PUT /api/chat/:conversationId/read', () => {
    it('should mark messages as read', async () => {
      mockChatService.markMessagesAsRead.mockResolvedValue({
        data: { success: true }
      })

      const response = await request(app)
        .put('/api/chat/user_user123_admin/read')
        .send({ userId: 'user123' })
        .expect(200)

      expect(response.body.data.success).toBe(true)
    })
  })

  describe('DELETE /api/chat/:conversationId/message/:messageId', () => {
    it('should delete a message', async () => {
      mockChatService.deleteMessage.mockResolvedValue({
        data: { message: 'Message deleted successfully' }
      })

      await request(app)
        .delete('/api/chat/conversation123/message/msg123')
        .send({ userId: 'user123' })
        .expect(200)
    })
  })

  describe('GET /api/chat/unread/:userId', () => {
    it('should return unread count', async () => {
      mockChatService.getUnreadCount.mockResolvedValue({
        data: { unreadCount: 5 }
      })

      const response = await request(app)
        .get('/api/chat/unread/user123')
        .expect(200)

      expect(response.body.data.unreadCount).toBe(5)
    })
  })
})