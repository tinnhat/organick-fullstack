import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import isEmpty from 'lodash/isEmpty'
import ApiError from '../utils/ApiError'
import { StatusOrder } from '../utils/constants'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    address: Joi.string().required().min(0).max(255).trim().strict().messages({
      'string.min': 'Address must be at least 1 characters long',
      'string.max': 'Address must be at most 255 characters long',
      'string.trim': 'Address must not have leading or trailing spaces',
      'string.base': 'Address must be a string',
      'any.required': 'Address is required',
      'string.empty': 'Address cannot be an empty field'
    }),
    phone: Joi.string().required().min(0).max(12).trim().strict().messages({
      'string.min': 'Phone must be at least 1 characters long',
      'string.max': 'Phone must be at most 12 characters long',
      'string.trim': 'Phone must not have leading or trailing spaces',
      'string.base': 'Phone must be a string',
      'any.required': 'Phone is required',
      'string.empty': 'Phone cannot be an empty field'
    }),
    note: Joi.string().optional().max(255).trim().strict(),
    userId: Joi.string().required().messages({
      'string.base': 'User id must be a string',
      'any.required': 'User id is required',
      'string.empty': 'User id cannot be an empty field'
    }),
    listProducts: Joi.array().required().messages({
      'array.base': 'List products must be an array',
      'any.required': 'List products is required',
      'array.empty': 'List products cannot be an empty array'
    }),
    totalPrice: Joi.number().required().min(1).max(9999).messages({
      'number.base': 'Total price must be a number',
      'any.required': 'Total price is required',
      'number.empty': 'Total price cannot be an empty field'
    }),
    stripeCheckoutLink: Joi.string().default('').optional(),
    checkOutSessionId: Joi.string().default('').optional(),
    isPaid: Joi.boolean().default(false).optional()
  })
  try {
    if (req.body.listProducts.length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'List products cannot be an empty array')
    }
    await check.validateAsync(req.body, { abortEarly: false })
    //validate true -> next sang controller
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const getOrderInParams = async (req: Request, res: Response, next: any) => {
  try {
    const orderId = req.params.id
    if (orderId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Order id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const getOrdersByUser = async (req: Request, res: Response, next: any) => {
  try {
    const orderId = req.params.id
    if (orderId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'User id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const editOrderInfo = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    address: Joi.string().optional().min(1).max(255).trim().strict(),
    phone: Joi.string().optional().min(1).max(255).trim().strict(),
    note: Joi.string().optional().max(255).trim().strict(),
    status: Joi.string().optional().valid(StatusOrder.Cancel, StatusOrder.Complete, StatusOrder.Pending),
    _destroy: Joi.boolean().default(false)
  })
  try {
    if (isEmpty(req.body)) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Choose at least one field to update')
    }
    await check.validateAsync(req.body, { abortEarly: false })
    //validate true -> next sang controller
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateOrderInfo = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    address: Joi.string().optional().min(1).max(255).trim().strict(),
    phone: Joi.string().optional().min(1).max(255).trim().strict(),
    note: Joi.string().optional().max(255).trim().strict(),
    listProducts: Joi.array().optional(),
    totalPrice: Joi.number().optional().min(1).max(9999),
    status: Joi.string().optional().valid(StatusOrder.Cancel, StatusOrder.Complete, StatusOrder.Pending),
    _destroy: Joi.boolean().default(false),
    isPaid: Joi.boolean().optional().default(false),
    stripeCheckoutLink: Joi.string().default('').optional(),
    checkOutSessionId: Joi.string().default('').optional()
  })
  try {
    if (isEmpty(req.body)) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Choose at least one field to update')
    }
    await check.validateAsync(req.body, { abortEarly: false })
    //validate true -> next sang controller
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const orderValidation = {
  createNew,
  getOrderInParams,
  editOrderInfo,
  updateOrderInfo,
  getOrdersByUser
}
