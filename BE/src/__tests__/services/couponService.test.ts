import { isAfter, addDays } from 'date-fns'
import { couponModel } from '../../models/couponModel'
import { responseData } from '../../utils/algorithms'
import ApiError from '../../utils/ApiError'

jest.mock('../../models/couponModel')
jest.mock('../../utils/algorithms')
jest.mock('../../utils/ApiError')

const mockCouponModel = couponModel as jest.Mock
const mockResponseData = responseData as jest.Mock

describe('CouponService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResponseData.mockImplementation((data) => ({ data }))
  })

  describe('createCoupon', () => {
    it('should create a coupon with valid data', async () => {
      const validData = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        expiresAt: addDays(new Date(), 30)
      }

      mockCouponModel.findOneByCode.mockResolvedValue(null)
      mockCouponModel.createNew.mockResolvedValue({ insertedId: 'coupon123' })
      mockCouponModel.findOneById.mockResolvedValue({
        _id: 'coupon123',
        ...validData,
        code: 'SAVE10'
      })

      const { createCoupon } = require('../../services/couponService')
      const result = await createCoupon(validData)

      expect(mockCouponModel.findOneByCode).toHaveBeenCalledWith('SAVE10')
      expect(mockCouponModel.createNew).toHaveBeenCalledWith({ ...validData, code: 'SAVE10' })
      expect(result.data.code).toBe('SAVE10')
    })

    it('should throw error when coupon code already exists', async () => {
      const existingData = {
        code: 'EXISTING',
        type: 'percentage',
        value: 10,
        expiresAt: addDays(new Date(), 30)
      }

      mockCouponModel.findOneByCode.mockResolvedValue({ _id: 'existing123', code: 'EXISTING' })

      const { createCoupon } = require('../../services/couponService')
      
      await expect(createCoupon(existingData)).rejects.toThrow('Coupon code already exists')
    })

    it('should uppercase the coupon code', async () => {
      const validData = {
        code: 'save20',
        type: 'fixed',
        value: 20,
        expiresAt: addDays(new Date(), 30)
      }

      mockCouponModel.findOneByCode.mockResolvedValue(null)
      mockCouponModel.createNew.mockResolvedValue({ insertedId: 'coupon123' })
      mockCouponModel.findOneById.mockResolvedValue({
        _id: 'coupon123',
        ...validData,
        code: 'SAVE20'
      })

      const { createCoupon } = require('../../services/couponService')
      await createCoupon(validData)

      expect(mockCouponModel.createNew).toHaveBeenCalledWith({ ...validData, code: 'SAVE20' })
    })
  })

  describe('applyCoupon', () => {
    const userId = 'user123'
    const orderAmount = 100

    it('should apply valid percentage coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)
      mockCouponModel.findAndUpdate.mockResolvedValue({ ...coupon, usedBy: [{ userId, usedAt: new Date() }] })

      const { applyCoupon } = require('../../services/couponService')
      const result = await applyCoupon('SAVE10', userId, orderAmount)

      expect(result.data.discountAmount).toBe(10)
      expect(result.data.finalAmount).toBe(90)
    })

    it('should apply valid fixed coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'FLAT20',
        type: 'fixed',
        value: 20,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)
      mockCouponModel.findAndUpdate.mockResolvedValue({ ...coupon, usedBy: [{ userId, usedAt: new Date() }] })

      const { applyCoupon } = require('../../services/couponService')
      const result = await applyCoupon('FLAT20', userId, orderAmount)

      expect(result.data.discountAmount).toBe(20)
      expect(result.data.finalAmount).toBe(80)
    })

    it('should throw error for expired coupon', async () => {
      const expiredCoupon = {
        _id: 'coupon123',
        code: 'EXPIRED',
        type: 'percentage',
        value: 10,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), -1),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(expiredCoupon)

      const { applyCoupon } = require('../../services/couponService')
      
      await expect(applyCoupon('EXPIRED', userId, orderAmount)).rejects.toThrow('Coupon has expired')
    })

    it('should throw error when user already used coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'ONCE',
        type: 'percentage',
        value: 10,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: [{ userId: 'user123', usedAt: new Date() }]
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { applyCoupon } = require('../../services/couponService')
      
      await expect(applyCoupon('ONCE', userId, orderAmount)).rejects.toThrow('You have already used this coupon')
    })

    it('should throw error when order amount is below minimum', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'MIN50',
        type: 'percentage',
        value: 10,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 100,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { applyCoupon } = require('../../services/couponService')
      
      await expect(applyCoupon('MIN50', userId, 50)).rejects.toThrow('Minimum order amount is 100')
    })

    it('should cap discount at order amount', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'BIG50',
        type: 'fixed',
        value: 150,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)
      mockCouponModel.findAndUpdate.mockResolvedValue({ ...coupon, usedBy: [{ userId, usedAt: new Date() }] })

      const { applyCoupon } = require('../../services/couponService')
      const result = await applyCoupon('BIG50', userId, orderAmount)

      expect(result.data.discountAmount).toBe(100)
      expect(result.data.finalAmount).toBe(0)
    })
  })

  describe('validateCoupon', () => {
    const userId = 'user123'
    const orderAmount = 100

    it('should validate a valid coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'VALID',
        type: 'percentage',
        value: 10,
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: null,
        usedBy: []
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { validateCoupon } = require('../../services/couponService')
      const result = await validateCoupon('VALID', userId, orderAmount)

      expect(result.data.valid).toBe(true)
      expect(result.data.type).toBe('percentage')
      expect(result.data.value).toBe(10)
    })

    it('should throw error for non-existent coupon', async () => {
      mockCouponModel.findOneByCode.mockResolvedValue(null)

      const { validateCoupon } = require('../../services/couponService')
      
      await expect(validateCoupon('NOTEXIST', userId, orderAmount)).rejects.toThrow('Coupon not found')
    })

    it('should throw error for inactive coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'INACTIVE',
        isActive: false,
        _destroy: false,
        expiresAt: addDays(new Date(), 30)
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { validateCoupon } = require('../../services/couponService')
      
      await expect(validateCoupon('INACTIVE', userId, orderAmount)).rejects.toThrow('Coupon is not active')
    })

    it('should throw error for deleted coupon', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'DELETED',
        isActive: true,
        _destroy: true,
        expiresAt: addDays(new Date(), 30)
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { validateCoupon } = require('../../services/couponService')
      
      await expect(validateCoupon('DELETED', userId, orderAmount)).rejects.toThrow('Coupon has been deleted')
    })

    it('should throw error when max uses reached', async () => {
      const coupon = {
        _id: 'coupon123',
        code: 'LIMITED',
        isActive: true,
        _destroy: false,
        expiresAt: addDays(new Date(), 30),
        minOrderAmount: 0,
        maxUses: 5,
        usedBy: [{ userId: 'u1' }, { userId: 'u2' }, { userId: 'u3' }, { userId: 'u4' }, { userId: 'u5' }]
      }

      mockCouponModel.findOneByCode.mockResolvedValue(coupon)

      const { validateCoupon } = require('../../services/couponService')
      
      await expect(validateCoupon('LIMITED', userId, orderAmount)).rejects.toThrow('Coupon usage limit has been reached')
    })
  })
})