import request from 'supertest'
import express from 'express'

jest.mock('../../services/couponService', () => ({
  couponServices: {
    createCoupon: jest.fn(),
    getCoupons: jest.fn(),
    getCouponById: jest.fn(),
    updateCoupon: jest.fn(),
    deleteCoupon: jest.fn(),
    validateCoupon: jest.fn(),
    applyCoupon: jest.fn()
  }
}))

jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
}))

const mockCouponServices = require('../../services/couponService').couponServices

const createApp = () => {
  const app = express()
  app.use(express.json())
  
  app.post('/api/coupons', async (req, res) => {
    try {
      const result = await mockCouponServices.createCoupon(req.body)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/coupons', async (req, res) => {
    try {
      const result = await mockCouponServices.getCoupons(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/coupons/:id', async (req, res) => {
    try {
      const result = await mockCouponServices.getCouponById(req.params.id)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.put('/api/coupons/:id', async (req, res) => {
    try {
      const result = await mockCouponServices.updateCoupon(req.params.id, req.body)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.delete('/api/coupons/:id', async (req, res) => {
    try {
      const result = await mockCouponServices.deleteCoupon(req.params.id)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.post('/api/coupons/validate', async (req, res) => {
    try {
      const { code, userId, orderAmount } = req.body
      const result = await mockCouponServices.validateCoupon(code, userId, orderAmount)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.post('/api/coupons/apply', async (req, res) => {
    try {
      const { code, userId, orderAmount } = req.body
      const result = await mockCouponServices.applyCoupon(code, userId, orderAmount)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return app
}

describe('Coupon API Routes', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    app = createApp()
  })

  describe('POST /api/coupons', () => {
    it('should create a new coupon', async () => {
      const couponData = {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 86400000)
      }

      mockCouponServices.createCoupon.mockResolvedValue({
        data: { _id: 'coupon123', ...couponData }
      })

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(201)

      expect(response.body.data.code).toBe('SAVE10')
    })

    it('should return error for invalid data', async () => {
      mockCouponServices.createCoupon.mockRejectedValue({
        statusCode: 400,
        message: 'Validation error'
      })

      await request(app)
        .post('/api/coupons')
        .send({})
        .expect(400)
    })
  })

  describe('GET /api/coupons', () => {
    it('should return paginated coupons', async () => {
      mockCouponServices.getCoupons.mockResolvedValue({
        data: {
          coupons: [{ _id: 'c1', code: 'SAVE10' }],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      })

      const response = await request(app)
        .get('/api/coupons')
        .expect(200)

      expect(response.body.data.coupons).toHaveLength(1)
    })

    it('should support filtering by isActive', async () => {
      mockCouponServices.getCoupons.mockResolvedValue({
        data: { coupons: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }
      })

      await request(app)
        .get('/api/coupons')
        .query({ isActive: 'true' })
        .expect(200)

      expect(mockCouponServices.getCoupons).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: 'true' })
      )
    })
  })

  describe('GET /api/coupons/:id', () => {
    it('should return a coupon by id', async () => {
      mockCouponServices.getCouponById.mockResolvedValue({
        data: { _id: 'coupon123', code: 'SAVE10' }
      })

      const response = await request(app)
        .get('/api/coupons/coupon123')
        .expect(200)

      expect(response.body.data._id).toBe('coupon123')
    })

    it('should return 404 for non-existent coupon', async () => {
      mockCouponServices.getCouponById.mockRejectedValue({
        statusCode: 404,
        message: 'Coupon not found'
      })

      await request(app)
        .get('/api/coupons/nonexistent')
        .expect(404)
    })
  })

  describe('PUT /api/coupons/:id', () => {
    it('should update a coupon', async () => {
      mockCouponServices.updateCoupon.mockResolvedValue({
        data: { _id: 'coupon123', code: 'UPDATED' }
      })

      const response = await request(app)
        .put('/api/coupons/coupon123')
        .send({ code: 'UPDATED' })
        .expect(200)

      expect(response.body.data.code).toBe('UPDATED')
    })
  })

  describe('DELETE /api/coupons/:id', () => {
    it('should delete a coupon', async () => {
      mockCouponServices.deleteCoupon.mockResolvedValue({
        data: { message: 'Coupon deleted successfully' }
      })

      await request(app)
        .delete('/api/coupons/coupon123')
        .expect(200)
    })
  })

  describe('POST /api/coupons/validate', () => {
    it('should validate a coupon', async () => {
      mockCouponServices.validateCoupon.mockResolvedValue({
        data: { valid: true, type: 'percentage', value: 10 }
      })

      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'SAVE10', userId: 'user123', orderAmount: 100 })
        .expect(200)

      expect(response.body.data.valid).toBe(true)
    })

    it('should return invalid for expired coupon', async () => {
      mockCouponServices.validateCoupon.mockRejectedValue({
        statusCode: 400,
        message: 'Coupon has expired'
      })

      await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'EXPIRED', userId: 'user123', orderAmount: 100 })
        .expect(400)
    })
  })

  describe('POST /api/coupons/apply', () => {
    it('should apply a coupon', async () => {
      mockCouponServices.applyCoupon.mockResolvedValue({
        data: {
          couponId: 'coupon123',
          couponCode: 'SAVE10',
          discountAmount: 10,
          originalAmount: 100,
          finalAmount: 90
        }
      })

      const response = await request(app)
        .post('/api/coupons/apply')
        .send({ code: 'SAVE10', userId: 'user123', orderAmount: 100 })
        .expect(200)

      expect(response.body.data.discountAmount).toBe(10)
      expect(response.body.data.finalAmount).toBe(90)
    })
  })
})