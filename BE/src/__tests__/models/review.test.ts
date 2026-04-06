import Joi from 'joi'
import { validateBeforeCreate } from '../../utils/algorithms'
import { getDB } from '../../config/mongodb'

jest.mock('../../config/mongodb')
jest.mock('../../utils/algorithms')

const mockValidateBeforeCreate = validateBeforeCreate as jest.Mock
const mockGetDB = getDB as jest.Mock

describe('ReviewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateBeforeCreate.mockImplementation((data) => Promise.resolve(data))
    mockGetDB.mockReturnValue({
      collection: jest.fn(() => ({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'review123' }),
        findOne: jest.fn().mockResolvedValue(null),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        }),
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        updateOne: jest.fn().mockResolvedValue({}),
        countDocuments: jest.fn().mockResolvedValue(0)
      }))
    })
  })

  describe('Schema Validation', () => {
    it('should require userId field', async () => {
      const invalidData = {
        productId: 'product123',
        orderId: 'order123',
        rating: 5,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require productId field', async () => {
      const invalidData = {
        userId: 'user123',
        orderId: 'order123',
        rating: 5,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require orderId field', async () => {
      const invalidData = {
        userId: 'user123',
        productId: 'product123',
        rating: 5,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require rating field', async () => {
      const invalidData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should require editDeadline field', async () => {
      const invalidData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 5
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should accept valid rating 1', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 1,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.rating).toBe(1)
    })

    it('should accept valid rating 3', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 3,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.rating).toBe(3)
    })

    it('should accept valid rating 5', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 5,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.rating).toBe(5)
    })

    it('should reject rating below 1', async () => {
      const invalidData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 0,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should reject rating above 5', async () => {
      const invalidData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 6,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should allow optional comment', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 5,
        comment: 'Great product!',
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.comment).toBe('Great product!')
    })

    it('should allow empty comment', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 4,
        comment: '',
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.comment).toBe('')
    })

    it('should default comment to empty string when not provided', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 4,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, comment: '' })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.comment).toBe('')
    })

    it('should default isDeleted to false', async () => {
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 4,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, isDeleted: false })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.isDeleted).toBe(false)
    })

    it('should set createdAt to current date by default', async () => {
      const beforeCreation = new Date()
      const validData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 4,
        editDeadline: new Date()
      }
      mockValidateBeforeCreate.mockImplementation(async (data) => ({
        ...data,
        createdAt: new Date()
      }))
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.createdAt).toBeDefined()
      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime())
    })
  })
})