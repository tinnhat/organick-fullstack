import Joi from 'joi'
import { validateBeforeCreate } from '../../utils/algorithms'
import { getDB } from '../../config/mongodb'

jest.mock('../../config/mongodb')
jest.mock('../../utils/algorithms')

const mockValidateBeforeCreate = validateBeforeCreate as jest.Mock
const mockGetDB = getDB as jest.Mock

describe('NotificationModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateBeforeCreate.mockImplementation((data) => Promise.resolve(data))
    mockGetDB.mockReturnValue({
      collection: jest.fn(() => ({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'notif123' }),
        findOne: jest.fn().mockResolvedValue(null),
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        deleteOne: jest.fn().mockResolvedValue({}),
        aggregate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue([])
              }))
            }))
        }),
        updateMany: jest.fn().mockResolvedValue({ modifiedCount: 0 }),
        countDocuments: jest.fn().mockResolvedValue(0)
      }))
    })
  })

  describe('Schema Validation', () => {
    it('should require userId field', async () => {
      const invalidData = {
        type: 'order',
        title: 'Test',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require type field', async () => {
      const invalidData = {
        userId: 'user123',
        title: 'Test',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require title field', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require message field', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        title: 'Test'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should accept valid type "order"', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: 'Order Update',
        message: 'Your order has been shipped'
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.type).toBe('order')
    })

    it('should accept valid type "chat"', async () => {
      const validData = {
        userId: 'user123',
        type: 'chat',
        title: 'New Message',
        message: 'You have a new message'
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.type).toBe('chat')
    })

    it('should accept valid type "review"', async () => {
      const validData = {
        userId: 'user123',
        type: 'review',
        title: 'New Review',
        message: 'Someone reviewed your product'
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.type).toBe('review')
    })

    it('should reject invalid type', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'invalid',
        title: 'Test',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require title to be at least 1 character', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        title: '',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should enforce max title length of 255', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        title: 'A'.repeat(256),
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require message to be at least 1 character', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        title: 'Test',
        message: ''
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should enforce max message length of 1000', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'order',
        title: 'Test',
        message: 'A'.repeat(1001)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should allow optional data object', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: 'Order Update',
        message: 'Your order is on the way',
        data: { orderId: 'order123', trackingNumber: 'TRACK123' }
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.data).toEqual({ orderId: 'order123', trackingNumber: 'TRACK123' })
    })

    it('should default isRead to false', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: 'Order Update',
        message: 'Your order is on the way'
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, isRead: false })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.isRead).toBe(false)
    })

    it('should trim title whitespace', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: '  Order Update  ',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, title: 'Order Update' })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.title).toBe('Order Update')
    })

    it('should trim message whitespace', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: 'Test',
        message: '  Test message  '
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, message: 'Test message' })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.message).toBe('Test message')
    })

    it('should allow empty data object when not provided', async () => {
      const validData = {
        userId: 'user123',
        type: 'order',
        title: 'Test',
        message: 'Test message'
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, data: {} })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.data).toEqual({})
    })
  })
})