import { reviewModel } from '../../models/reviewModel'
import { orderModel } from '../../models/orderModel'
import { notificationService } from './notificationService'
import ApiError from '../../utils/ApiError'
import { responseData } from '../../utils/algorithms'

jest.mock('../../models/reviewModel')
jest.mock('../../models/orderModel')
jest.mock('../../services/notificationService')
jest.mock('../../utils/algorithms')

const mockReviewModel = reviewModel as jest.Mock
const mockOrderModel = orderModel as jest.Mock
const mockNotificationService = notificationService as jest.Mock
const mockResponseData = responseData as jest.Mock

describe('ReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResponseData.mockImplementation((data) => ({ data }))
  })

  describe('createReview', () => {
    const userId = 'user123'
    const productId = 'product123'
    const orderId = 'order123'

    it('should throw error when user never purchased product', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({ data: [] })

      const { createReview } = require('../../services/reviewService')
      
      await expect(createReview(userId, productId, orderId, 5, 'Great!')).rejects.toThrow('You have not purchased this product')
    })

    it('should throw error when order is not completed', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Pending'
        }]
      })

      const { createReview } = require('../../services/reviewService')
      
      await expect(createReview(userId, productId, orderId, 5, 'Great!')).rejects.toThrow('You can only review products from completed or delivered orders')
    })

    it('should throw error when user already reviewed product', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Completed'
        }]
      })
      mockReviewModel.findOneByUserAndProduct.mockResolvedValue({ _id: 'existingReview' })

      const { createReview } = require('../../services/reviewService')
      
      await expect(createReview(userId, productId, orderId, 5, 'Great!')).rejects.toThrow('You have already reviewed this product')
    })

    it('should create review successfully', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Completed'
        }]
      })
      mockReviewModel.findOneByUserAndProduct.mockResolvedValue(null)
      mockReviewModel.createNew.mockResolvedValue({ insertedId: 'review123' })
      mockReviewModel.findOneById.mockResolvedValue({
        _id: 'review123',
        userId,
        productId,
        orderId,
        rating: 5,
        comment: 'Great!'
      })

      const mockFindAdminUser = jest.fn().mockResolvedValue({ _id: 'admin123', isAdmin: true })
      const mockGetProductDetails = jest.fn().mockResolvedValue({ name: 'Test Product' })
      
      jest.mock('../../services/reviewService', () => ({
        findAdminUser: mockFindAdminUser,
        getProductDetails: mockGetProductDetails
      }), { virtual: true })

      const { createReview } = require('../../services/reviewService')
      const result = await createReview(userId, productId, orderId, 5, 'Great!')

      expect(mockReviewModel.createNew).toHaveBeenCalled()
      expect(result.data.rating).toBe(5)
    })
  })

  describe('updateReview', () => {
    it('should throw error when review not found', async () => {
      mockReviewModel.findOneById.mockResolvedValue(null)

      const { updateReview } = require('../../services/reviewService')
      
      await expect(updateReview('review123', 'user123', 4, 'Updated')).rejects.toThrow('Review not found')
    })

    it('should throw error when user is not the review owner', async () => {
      mockReviewModel.findOneById.mockResolvedValue({
        _id: 'review123',
        userId: 'differentUser',
        editDeadline: new Date(Date.now() + 86400000)
      })

      const { updateReview } = require('../../services/reviewService')
      
      await expect(updateReview('review123', 'user123', 4, 'Updated')).rejects.toThrow('You can only update your own reviews')
    })

    it('should throw error when edit deadline has passed', async () => {
      mockReviewModel.findOneById.mockResolvedValue({
        _id: 'review123',
        userId: 'user123',
        editDeadline: new Date(Date.now() - 86400000)
      })

      const { updateReview } = require('../../services/reviewService')
      
      await expect(updateReview('review123', 'user123', 4, 'Updated')).rejects.toThrow('Edit deadline has passed')
    })

    it('should update review within deadline', async () => {
      const review = {
        _id: 'review123',
        userId: 'user123',
        rating: 3,
        comment: 'Original',
        editDeadline: new Date(Date.now() + 86400000)
      }
      mockReviewModel.findOneById.mockResolvedValue(review)
      mockReviewModel.findAndUpdate.mockResolvedValue({ ...review, rating: 4, comment: 'Updated' })

      const { updateReview } = require('../../services/reviewService')
      const result = await updateReview('review123', 'user123', 4, 'Updated')

      expect(mockReviewModel.findAndUpdate).toHaveBeenCalled()
      expect(result.data.rating).toBe(4)
    })
  })

  describe('canUserReviewProduct', () => {
    const userId = 'user123'
    const productId = 'product123'

    it('should return canReview false when user has no orders', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({ data: [] })

      const { canUserReviewProduct } = require('../../services/reviewService')
      const result = await canUserReviewProduct(userId, productId)

      expect(result.canReview).toBe(false)
      expect(result.reason).toBe('No orders found')
    })

    it('should return canReview false when user has no completed orders with product', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Pending'
        }]
      })

      const { canUserReviewProduct } = require('../../services/reviewService')
      const result = await canUserReviewProduct(userId, productId)

      expect(result.canReview).toBe(false)
      expect(result.reason).toBe('No completed order with this product')
    })

    it('should return canReview false when user already reviewed', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Completed'
        }]
      })
      mockReviewModel.findOneByUserAndProduct.mockResolvedValue({ _id: 'review123' })

      const { canUserReviewProduct } = require('../../services/reviewService')
      const result = await canUserReviewProduct(userId, productId)

      expect(result.canReview).toBe(false)
      expect(result.reason).toBe('Already reviewed')
    })

    it('should return canReview true when user can review', async () => {
      mockOrderModel.getOrdersByUser.mockResolvedValue({
        data: [{
          _id: 'order123',
          listProducts: [{ _id: 'product123' }],
          status: 'Completed'
        }]
      })
      mockReviewModel.findOneByUserAndProduct.mockResolvedValue(null)

      const { canUserReviewProduct } = require('../../services/reviewService')
      const result = await canUserReviewProduct(userId, productId)

      expect(result.canReview).toBe(true)
    })
  })
})