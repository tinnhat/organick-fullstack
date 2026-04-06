// ============ FEATURE: reviews START ============
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import isEmpty from 'lodash/isEmpty'
import ApiError from '../utils/ApiError'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    productId: Joi.string().required().messages({
      'string.base': 'Product id must be a string',
      'any.required': 'Product id is required',
      'string.empty': 'Product id cannot be an empty field'
    }),
    orderId: Joi.string().required().messages({
      'string.base': 'Order id must be a string',
      'any.required': 'Order id is required',
      'string.empty': 'Order id cannot be an empty field'
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      'number.base': 'Rating must be a number',
      'any.required': 'Rating is required',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5'
    }),
    comment: Joi.string().optional().allow('').max(1000).messages({
      'string.max': 'Comment must be at most 1000 characters long'
    })
  })
  try {
    await check.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      'number.base': 'Rating must be a number',
      'any.required': 'Rating is required',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5'
    }),
    comment: Joi.string().optional().allow('').max(1000).messages({
      'string.max': 'Comment must be at most 1000 characters long'
    })
  })
  try {
    if (isEmpty(req.body)) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Choose at least one field to update')
    }
    await check.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const validateReviewId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = req.params.id
    if (reviewId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Review id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const validateProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId
    if (productId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Product id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const reviewValidation = {
  createNew,
  updateReview,
  validateReviewId,
  validateProductReviews
}
// ============ FEATURE: reviews END ============
