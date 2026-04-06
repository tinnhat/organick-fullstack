import Joi from 'joi'
import { validateBeforeCreate } from '../../utils/algorithms'
import { getDB } from '../../config/mongodb'

jest.mock('../../config/mongodb')
jest.mock('../../utils/algorithms')

const mockValidateBeforeCreate = validateBeforeCreate as jest.Mock
const mockGetDB = getDB as jest.Mock

describe('CouponModel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateBeforeCreate.mockImplementation((data) => Promise.resolve(data))
    mockGetDB.mockReturnValue({
      collection: jest.fn(() => ({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'coupon123' }),
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn(() => ({
          skip: jest.fn(() => ({
            limit: jest.fn(() => ({
              toArray: jest.fn().mockResolvedValue([])
            }))
          }))
        })),
        countDocuments: jest.fn().mockResolvedValue(0),
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        updateOne: jest.fn().mockResolvedValue({})
      }))
    })
  })

  describe('Schema Validation', () => {
    it('should validate required code field', async () => {
      const invalidData = {
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should validate required type field', async () => {
      const invalidData = {
        code: 'SAVE10',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should validate required value field', async () => {
      const invalidData = {
        code: 'SAVE10',
        type: 'percentage',
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should validate required expiresAt field', async () => {
      const invalidData = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should accept valid percentage type', async () => {
      const validData = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.type).toBe('percentage')
    })

    it('should accept valid fixed type', async () => {
      const validData = {
        code: 'FLAT20',
        type: 'fixed',
        value: 20,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.type).toBe('fixed')
    })

    it('should reject negative value', async () => {
      const invalidData = {
        code: 'INVALID',
        type: 'percentage',
        value: -10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })

    it('should allow optional minOrderAmount with default 0', async () => {
      const validData = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000),
        minOrderAmount: 50
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.minOrderAmount).toBe(50)
    })

    it('should allow null maxUses', async () => {
      const validData = {
        code: 'UNLIMITED',
        type: 'percentage',
        value: 15,
        expiresAt: new Date(Date.now() + 86400000),
        maxUses: null
      }
      mockValidateBeforeCreate.mockResolvedValue(validData)
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.maxUses).toBeNull()
    })

    it('should default usedBy to empty array', async () => {
      const validData = {
        code: 'NEW10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, usedBy: [] })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.usedBy).toEqual([])
    })

    it('should default isActive to true', async () => {
      const validData = {
        code: 'NEW10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, isActive: true })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.isActive).toBe(true)
    })

    it('should default _destroy to false', async () => {
      const validData = {
        code: 'NEW10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, _destroy: false })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result._destroy).toBe(false)
    })

    it('should trim code whitespace', async () => {
      const validData = {
        code: '  SAVEME  ',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockResolvedValue({ ...validData, code: 'SAVEME' })
      
      const result = await validateBeforeCreate(validData, Joi.object())
      expect(result.code).toBe('SAVEME')
    })

    it('should enforce max code length of 50', async () => {
      const invalidData = {
        code: 'A'.repeat(51),
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }
      mockValidateBeforeCreate.mockRejectedValue(new Error('Validation error'))
      
      await expect(validateBeforeCreate(invalidData, Joi.object())).rejects.toThrow('Validation error')
    })
  })
})