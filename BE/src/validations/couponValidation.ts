import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '../utils/ApiError'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    code: Joi.string().required().min(1).max(50).trim().strict().messages({
      'string.min': 'Code must be at least 1 characters long',
      'string.max': 'Code must be at most 50 characters long',
      'string.trim': 'Code must not have leading or trailing spaces',
      'string.base': 'Code must be a string',
      'any.required': 'Code is required',
      'string.empty': 'Code cannot be an empty field'
    }),
    type: Joi.string().required().valid('percentage', 'fixed').messages({
      'string.base': 'Type must be a string',
      'any.required': 'Type is required',
      'any.only': 'Type must be either percentage or fixed'
    }),
    value: Joi.number().required().min(0).messages({
      'number.base': 'Value must be a number',
      'any.required': 'Value is required',
      'number.min': 'Value must be at least 0'
    }),
    minOrderAmount: Joi.number().min(0).default(0).messages({
      'number.base': 'Min order amount must be a number',
      'number.min': 'Min order amount must be at least 0'
    }),
    maxUses: Joi.number().allow(null).min(1).default(null).messages({
      'number.base': 'Max uses must be a number',
      'number.min': 'Max uses must be at least 1'
    }),
    expiresAt: Joi.date().timestamp('javascript').required().messages({
      'date.base': 'Expires at must be a valid date',
      'any.required': 'Expires at is required'
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

const applyCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    code: Joi.string().required().min(1).max(50).trim().strict().messages({
      'string.min': 'Code must be at least 1 characters long',
      'string.max': 'Code must be at most 50 characters long',
      'string.trim': 'Code must not have leading or trailing spaces',
      'string.base': 'Code must be a string',
      'any.required': 'Code is required',
      'string.empty': 'Code cannot be an empty field'
    }),
    orderAmount: Joi.number().required().min(0).messages({
      'number.base': 'Order amount must be a number',
      'any.required': 'Order amount is required',
      'number.min': 'Order amount must be at least 0'
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

const getCouponInParams = async (req: Request, res: Response, next: any) => {
  try {
    const couponId = req.params.id
    if (couponId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Coupon id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    code: Joi.string().min(1).max(50).trim().strict(),
    type: Joi.string().valid('percentage', 'fixed'),
    value: Joi.number().min(0),
    minOrderAmount: Joi.number().min(0).default(0),
    maxUses: Joi.number().allow(null).min(1).default(null),
    expiresAt: Joi.date().timestamp('javascript'),
    isActive: Joi.boolean().default(true)
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

export const couponValidation = {
  createNew,
  applyCoupon,
  getCouponInParams,
  updateCoupon
}
