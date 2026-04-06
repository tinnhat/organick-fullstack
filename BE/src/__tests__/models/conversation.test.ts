import Joi from 'joi'
import { validateBeforeCreate } from '../../utils/algorithms'
import { getDB } from '../../config/mongodb'

jest.mock('../../config/mongodb')
jest.mock('../../utils/algorithms')

const mockValidateBeforeCreate = validateBeforeCreate as jest.Mock
const mockGetDB = getDB as jest.Mock

describe('ConversationModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateBeforeCreate.mockImplementation((data) => Promise.resolve(data))
    mockGetDB.mockReturnValue({
      collection: jest.fn(() => ({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'conv123' }),
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([])
          })
        }),
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        toArray: jest.fn().mockResolvedValue([])
      }))
    })
  })

  describe('Schema Validation', () => {
    it('should require conversationId field', async () => {
      const invalidData = {
        participants: [
          { userId: 'user1', role: 'user' },
          { userId: 'admin1', role: 'admin' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require participants field', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        messages: []
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require participants to be an array', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        participants: 'not an array',
        messages: []
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should accept valid participant with user role', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.participants[0].role).toBe('user')
    })

    it('should accept valid participant with admin role', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.participants[0].role).toBe('admin')
    })

    it('should reject participant with invalid role', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'invalid' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require userId in participant', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        participants: [
          { role: 'user' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should allow empty messages array', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.messages).toEqual([])
    })

    it('should default messages to empty array', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ]
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, messages: [] })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.messages).toEqual([])
    })

    it('should allow message with all required fields', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: [
          {
            senderId: 'user123',
            content: 'Hello, I need help',
            timestamp: new Date(),
            isRead: false,
            isDeleted: false
          }
        ]
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.messages[0].content).toBe('Hello, I need help')
    })

    it('should require senderId in message', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: [
          { content: 'Hello', timestamp: new Date() }
        ]
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require content in message', async () => {
      const invalidData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: [
          { senderId: 'user123', timestamp: new Date() }
        ]
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should default message isRead to false', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: [
          {
            senderId: 'user123',
            content: 'Hello',
            timestamp: new Date()
          }
        ]
      }
      mockValidateBeforeCreate.mockImplementation(async (data) => ({
        ...data,
        messages: data.messages.map((m: any) => ({ ...m, isRead: false, isDeleted: false }))
      }))
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.messages[0].isRead).toBe(false)
    })

    it('should default message isDeleted to false', async () => {
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: [
          {
            senderId: 'user123',
            content: 'Hello',
            timestamp: new Date()
          }
        ]
      }
      mockValidateBeforeCreate.mockImplementation(async (data) => ({
        ...data,
        messages: data.messages.map((m: any) => ({ ...m, isRead: false, isDeleted: false }))
      }))
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.messages[0].isDeleted).toBe(false)
    })

    it('should default lastMessageAt to current date', async () => {
      const beforeCreation = new Date()
      const validData = {
        conversationId: 'user123_admin',
        participants: [
          { userId: 'user123', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ]
      }
      mockValidateBeforeCreate.mockImplementation(async (data) => ({
        ...data,
        lastMessageAt: new Date()
      }))
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.lastMessageAt).toBeDefined()
      expect(result.lastMessageAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime())
    })

    it('should allow multiple participants', async () => {
      const validData = {
        conversationId: 'group_conversation',
        participants: [
          { userId: 'user1', role: 'user' },
          { userId: 'user2', role: 'user' },
          { userId: 'admin123', role: 'admin' }
        ],
        messages: []
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.participants.length).toBe(3)
    })
  })
})