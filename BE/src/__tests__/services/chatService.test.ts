import { conversationModel } from '../../models/conversationModel'
import { notificationService } from './notificationService'
import ApiError from '../../utils/ApiError'
import { responseData } from '../../utils/algorithms'

jest.mock('../../models/conversationModel')
jest.mock('../../services/notificationService')
jest.mock('../../utils/algorithms')

const mockConversationModel = conversationModel as jest.Mock
const mockNotificationService = notificationService as jest.Mock
const mockResponseData = responseData as jest.Mock

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResponseData.mockImplementation((data) => ({ data }))
  })

  describe('getOrCreateConversation', () => {
    it('should return existing conversation', async () => {
      const existingConversation = {
        _id: 'conv123',
        conversationId: 'user_user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(existingConversation)

      const { getOrCreateConversation } = require('../../services/chatService')
      const result = await getOrCreateConversation('user123')

      expect(mockConversationModel.findOneByConversationId).toHaveBeenCalledWith('user_user123_admin')
      expect(result).toEqual(existingConversation)
    })

    it('should create new conversation if not exists', async () => {
      mockConversationModel.findOneByConversationId.mockResolvedValue(null)
      
      const mockFindAdminUser = jest.fn().mockResolvedValue({ _id: 'admin123', isAdmin: true })
      jest.doMock('../../services/chatService', () => ({
        findAdminUser: mockFindAdminUser
      }), { virtual: true })

      const newConversation = {
        _id: 'newConv123',
        conversationId: 'user_user456_admin',
        participants: [
          { userId: 'user456', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }

      mockConversationModel.createNew.mockResolvedValue({ insertedId: 'newConv123' })
      mockConversationModel.findOneByConversationId.mockResolvedValue(newConversation)

      const { getOrCreateConversation } = require('../../services/chatService')
      const result = await getOrCreateConversation('user456')

      expect(mockConversationModel.createNew).toHaveBeenCalled()
      expect(result).toEqual(newConversation)
    })
  })

  describe('getConversation', () => {
    it('should return conversation by id', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId: 'user_user123_admin',
        messages: []
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(conversation)

      const { getConversation } = require('../../services/chatService')
      const result = await getConversation('user_user123_admin')

      expect(result).toEqual(conversation)
    })

    it('should throw error when conversation not found', async () => {
      mockConversationModel.findOneByConversationId.mockResolvedValue(null)

      const { getConversation } = require('../../services/chatService')
      
      await expect(getConversation('nonexistent')).rejects.toThrow('Conversation not found')
    })
  })

  describe('addMessage', () => {
    const conversationId = 'user_user123_admin'
    const senderId = 'user123'
    const content = 'Hello, I need help'

    it('should add message to existing conversation', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId,
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }

      const newMessage = {
        _id: 'msg123',
        senderId: 'user123',
        content: 'Hello, I need help',
        timestamp: new Date(),
        isRead: false,
        isDeleted: false
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(conversation)
      mockConversationModel.addMessage.mockResolvedValue({
        ...conversation,
        messages: [newMessage]
      })

      const { addMessage } = require('../../services/chatService')
      const result = await addMessage(conversationId, senderId, content)

      expect(mockConversationModel.addMessage).toHaveBeenCalledWith(
        conversationId,
        expect.objectContaining({
          senderId: expect.anything(),
          content: 'Hello, I need help'
        })
      )
      expect(result.content).toBe('Hello, I need help')
    })

    it('should throw error for empty content', async () => {
      const { addMessage } = require('../../services/chatService')
      
      await expect(addMessage(conversationId, senderId, '')).rejects.toThrow('Message content cannot be empty')
    })

    it('should throw error when conversation not found', async () => {
      mockConversationModel.findOneByConversationId.mockResolvedValue(null)

      const { addMessage } = require('../../services/chatService')
      
      await expect(addMessage('nonexistent', senderId, 'Hello')).rejects.toThrow('Conversation not found')
    })

    it('should throw error when user is not a participant', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId,
        participants: [
          { userId: 'otherUser', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ]
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(conversation)

      const { addMessage } = require('../../services/chatService')
      
      await expect(addMessage(conversationId, senderId, 'Hello')).rejects.toThrow('User is not a participant in this conversation')
    })

    it('should create notification for recipient', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId,
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ]
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(conversation)
      mockConversationModel.addMessage.mockResolvedValue({
        ...conversation,
        messages: [{ _id: 'msg123', senderId: 'user123', content: 'Hello' }]
      })
      mockNotificationService.createNotification.mockResolvedValue({ insertedId: 'notif123' })

      const { addMessage } = require('../../services/chatService')
      await addMessage(conversationId, senderId, content)

      expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
        'admin123',
        'chat',
        'New Message',
        'Hello, I need help',
        { senderId: 'user123', conversationId }
      )
    })
  })

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const conversation = {
        _id: 'conv123',
        conversationId: 'user_user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ]
      }

      mockConversationModel.findOneByConversationId.mockResolvedValue(conversation)
      mockConversationModel.markMessagesAsRead.mockResolvedValue({
        ...conversation,
        messages: [{ isRead: true }]
      })

      const { markMessagesAsRead } = require('../../services/chatService')
      const result = await markMessagesAsRead('user_user123_admin', 'user123')

      expect(mockConversationModel.markMessagesAsRead).toHaveBeenCalledWith('user_user123_admin', 'user123')
      expect(result.data).toBeDefined()
    })

    it('should throw error when conversation not found', async () => {
      mockConversationModel.findOneByConversationId.mockResolvedValue(null)

      const { markMessagesAsRead } = require('../../services/chatService')
      
      await expect(markMessagesAsRead('nonexistent', 'user123')).rejects.toThrow('Conversation not found')
    })
  })
})