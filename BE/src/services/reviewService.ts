// ============ FEATURE: reviews START ============
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import moment from 'moment'
import { reviewModel } from '../models/reviewModel'
import { orderModel } from '../models/orderModel'
import { userModel } from '../models/userModel'
import { notificationService } from './notificationService'
import ApiError from '../utils/ApiError'
import { responseData } from '../utils/algorithms'
/* eslint-disable no-useless-catch */

const createReview = async (userId: string, productId: string, orderId: string, rating: number, comment?: string) => {
  try {
    const userOrders = await orderModel.getOrdersByUser(userId, 1, 100)
    if (!userOrders || userOrders.data.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You have not purchased this product')
    }

    const hasCompletedOrder = userOrders.data.some((order: any) => {
      const hasProduct = order.listProducts.some((p: any) => p._id === productId)
      const isCompleted = order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Complete'
      return hasProduct && isCompleted
    })

    if (!hasCompletedOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You can only review products from completed or delivered orders')
    }

    const existingReview = await reviewModel.findOneByUserAndProduct(userId, productId)
    if (existingReview) {
      throw new ApiError(StatusCodes.CONFLICT, 'You have already reviewed this product')
    }

    const createdAt = new Date()
    const editDeadline = moment(createdAt).add(5, 'days').toDate()

    const review = await reviewModel.createNew({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      orderId: new ObjectId(orderId),
      rating,
      comment: comment || '',
      createdAt,
      editDeadline,
      isDeleted: false
    })

    const getReview = await reviewModel.findOneById(review.insertedId.toString())
    
    const adminUser = await findAdminUser()
    const product = await getProductDetails(productId)
    if (adminUser) {
      await notificationService.createNotification(
        adminUser._id.toString(),
        'review',
        'New Review',
        `New ${rating}-star review on ${product?.name || 'a product'}`,
        { reviewId: review.insertedId.toString(), productId, rating }
      )
    }
    
    return responseData(getReview)
  } catch (error) {
    throw error
  }
}

const findAdminUser = async () => {
  const { users } = await userModel.getUsers()
  const admin = users.find((u: any) => u.isAdmin === true)
  return admin || null
}

const getProductDetails = async (productId: string) => {
  const { productModel } = await import('../models/productModel')
  return await productModel.findOneById(productId)
}

const updateReview = async (id: string, userId: string, rating: number, comment?: string) => {
  try {
    const review = await reviewModel.findOneById(id)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found')
    }

    if (review.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only update your own reviews')
    }

    const now = new Date()
    if (now > new Date(review.editDeadline)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Edit deadline has passed. You can no longer update this review')
    }

    await reviewModel.findAndUpdate(id, {
      rating,
      comment: comment || ''
    })

    const updatedReview = await reviewModel.findOneById(id)
    return responseData(updatedReview)
  } catch (error) {
    throw error
  }
}

const deleteReview = async (id: string, userId: string, isAdmin: boolean) => {
  try {
    const review = await reviewModel.findOneById(id)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found')
    }

    if (!isAdmin && review.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only delete your own reviews')
    }

    await reviewModel.findAndRemove(id)
    return responseData({ message: 'Review deleted successfully' })
  } catch (error) {
    throw error
  }
}

const getProductReviews = async (productId: string, page: number, limit: number) => {
  try {
    const reviews = await reviewModel.getReviewsByProduct(productId, page, limit)
    const total = await reviewModel.countReviewsByProduct(productId)
    const averageRating = await reviewModel.getAverageRating(productId)

    return responseData({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      averageRating: averageRating ? Number(averageRating.toFixed(1)) : 0
    })
  } catch (error) {
    throw error
  }
}

const canUserReviewProduct = async (userId: string, productId: string) => {
  try {
    const userOrders = await orderModel.getOrdersByUser(userId, 1, 100)
    if (!userOrders || userOrders.data.length === 0) {
      return { canReview: false, reason: 'No orders found' }
    }

    const hasCompletedOrder = userOrders.data.some((order: any) => {
      const hasProduct = order.listProducts.some((p: any) => p._id === productId)
      const isCompleted = order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Complete'
      return hasProduct && isCompleted
    })

    if (!hasCompletedOrder) {
      return { canReview: false, reason: 'No completed order with this product' }
    }

    const existingReview = await reviewModel.findOneByUserAndProduct(userId, productId)
    if (existingReview) {
      return { canReview: false, reason: 'Already reviewed' }
    }

    return { canReview: true }
  } catch (error) {
    throw error
  }
}

const getProductAverageRating = async (productId: string) => {
  try {
    const averageRating = await reviewModel.getAverageRating(productId)
    return responseData({
      productId,
      averageRating: averageRating ? Number(averageRating.toFixed(1)) : 0
    })
  } catch (error) {
    throw error
  }
}

export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  canUserReviewProduct,
  getProductAverageRating
}
// ============ FEATURE: reviews END ============
