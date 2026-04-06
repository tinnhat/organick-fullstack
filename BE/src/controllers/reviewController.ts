// ============ FEATURE: reviews START ============
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { reviewService } from '../services/reviewService'

const createNew = async (req: any, res: Response, next: any) => {
  try {
    const { productId, orderId, rating, comment } = req.body
    const userId = req.user._id.toString()
    const review = await reviewService.createReview(userId, productId, orderId, rating, comment)
    res.status(StatusCodes.CREATED).json(review)
  } catch (error) {
    next(error)
  }
}

const updateReview = async (req: any, res: Response, next: any) => {
  try {
    const { rating, comment } = req.body
    const userId = req.user._id.toString()
    const review = await reviewService.updateReview(req.params.id, userId, rating, comment)
    res.status(StatusCodes.OK).json(review)
  } catch (error) {
    next(error)
  }
}

const deleteReview = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const isAdmin = req.user.isAdmin
    const result = await reviewService.deleteReview(req.params.id, userId, isAdmin)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getProductReviews = async (req: Request, res: Response, next: any) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const reviews = await reviewService.getProductReviews(req.params.productId, page, limit)
    res.status(StatusCodes.OK).json(reviews)
  } catch (error) {
    next(error)
  }
}

const getProductAverageRating = async (req: Request, res: Response, next: any) => {
  try {
    const result = await reviewService.getProductAverageRating(req.params.productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const canUserReviewProduct = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await reviewService.canUserReviewProduct(userId, req.params.productId)
    res.status(StatusCodes.OK).json(responseData(result))
  } catch (error) {
    next(error)
  }
}

export const reviewController = {
  createNew,
  updateReview,
  deleteReview,
  getProductReviews,
  getProductAverageRating,
  canUserReviewProduct
}

function responseData(data: any) {
  return { success: true, data }
}
// ============ FEATURE: reviews END ============
