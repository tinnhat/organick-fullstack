import request from 'supertest'
import express from 'express'

jest.mock('../../services/reviewService', () => ({
  reviewService: {
    createReview: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
    getProductReviews: jest.fn(),
    canUserReviewProduct: jest.fn(),
    getProductAverageRating: jest.fn()
  }
}))

jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
}))

const mockReviewService = require('../../services/reviewService').reviewService

const createApp = () => {
  const app = express()
  app.use(express.json())
  
  app.post('/api/reviews', async (req, res) => {
    try {
      const { userId, productId, orderId, rating, comment } = req.body
      const result = await mockReviewService.createReview(userId, productId, orderId, rating, comment)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.put('/api/reviews/:id', async (req, res) => {
    try {
      const { userId, rating, comment } = req.body
      const result = await mockReviewService.updateReview(req.params.id, userId, rating, comment)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      const { userId, isAdmin } = req.body
      const result = await mockReviewService.deleteReview(req.params.id, userId, isAdmin)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/reviews/product/:productId', async (req, res) => {
    try {
      const { page, limit } = req.query
      const result = await mockReviewService.getProductReviews(req.params.productId, page || 1, limit || 10)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/reviews/can-review', async (req, res) => {
    try {
      const { userId, productId } = req.query
      const result = await mockReviewService.canUserReviewProduct(userId, productId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/reviews/average/:productId', async (req, res) => {
    try {
      const result = await mockReviewService.getProductAverageRating(req.params.productId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return app
}

describe('Review API Routes', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    app = createApp()
  })

  describe('POST /api/reviews', () => {
    it('should create a new review', async () => {
      const reviewData = {
        userId: 'user123',
        productId: 'product123',
        orderId: 'order123',
        rating: 5,
        comment: 'Great product!'
      }

      mockReviewService.createReview.mockResolvedValue({
        data: { _id: 'review123', ...reviewData }
      })

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201)

      expect(response.body.data.rating).toBe(5)
    })

    it('should return error when user has not purchased', async () => {
      mockReviewService.createReview.mockRejectedValue({
        statusCode: 400,
        message: 'You have not purchased this product'
      })

      await request(app)
        .post('/api/reviews')
        .send({
          userId: 'user123',
          productId: 'product123',
          orderId: 'order123',
          rating: 5
        })
        .expect(400)
    })

    it('should return error when user already reviewed', async () => {
      mockReviewService.createReview.mockRejectedValue({
        statusCode: 409,
        message: 'You have already reviewed this product'
      })

      await request(app)
        .post('/api/reviews')
        .send({
          userId: 'user123',
          productId: 'product123',
          orderId: 'order123',
          rating: 5
        })
        .expect(409)
    })
  })

  describe('PUT /api/reviews/:id', () => {
    it('should update a review', async () => {
      mockReviewService.updateReview.mockResolvedValue({
        data: { _id: 'review123', rating: 4, comment: 'Updated review' }
      })

      const response = await request(app)
        .put('/api/reviews/review123')
        .send({ userId: 'user123', rating: 4, comment: 'Updated review' })
        .expect(200)

      expect(response.body.data.rating).toBe(4)
    })

    it('should return error when edit deadline passed', async () => {
      mockReviewService.updateReview.mockRejectedValue({
        statusCode: 403,
        message: 'Edit deadline has passed'
      })

      await request(app)
        .put('/api/reviews/review123')
        .send({ userId: 'user123', rating: 4 })
        .expect(403)
    })
  })

  describe('DELETE /api/reviews/:id', () => {
    it('should delete a review', async () => {
      mockReviewService.deleteReview.mockResolvedValue({
        data: { message: 'Review deleted successfully' }
      })

      await request(app)
        .delete('/api/reviews/review123')
        .send({ userId: 'user123', isAdmin: false })
        .expect(200)
    })
  })

  describe('GET /api/reviews/product/:productId', () => {
    it('should return paginated reviews', async () => {
      mockReviewService.getProductReviews.mockResolvedValue({
        data: {
          reviews: [{ _id: 'r1', rating: 5 }],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          averageRating: 5
        }
      })

      const response = await request(app)
        .get('/api/reviews/product/product123')
        .expect(200)

      expect(response.body.data.reviews).toHaveLength(1)
      expect(response.body.data.averageRating).toBe(5)
    })
  })

  describe('GET /api/reviews/can-review', () => {
    it('should return can review status', async () => {
      mockReviewService.canUserReviewProduct.mockResolvedValue({
        canReview: true
      })

      const response = await request(app)
        .get('/api/reviews/can-review')
        .query({ userId: 'user123', productId: 'product123' })
        .expect(200)

      expect(response.body.canReview).toBe(true)
    })

    it('should return canReview false when already reviewed', async () => {
      mockReviewService.canUserReviewProduct.mockResolvedValue({
        canReview: false,
        reason: 'Already reviewed'
      })

      const response = await request(app)
        .get('/api/reviews/can-review')
        .query({ userId: 'user123', productId: 'product123' })
        .expect(200)

      expect(response.body.canReview).toBe(false)
      expect(response.body.reason).toBe('Already reviewed')
    })
  })

  describe('GET /api/reviews/average/:productId', () => {
    it('should return average rating', async () => {
      mockReviewService.getProductAverageRating.mockResolvedValue({
        data: { productId: 'product123', averageRating: 4.5 }
      })

      const response = await request(app)
        .get('/api/reviews/average/product123')
        .expect(200)

      expect(response.body.data.averageRating).toBe(4.5)
    })
  })
})