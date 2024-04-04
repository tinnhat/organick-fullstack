import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '../utils/ApiError'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    name: Joi.string().required().min(1).max(255).trim().strict().messages({
      'string.min': 'Name must be at least 1 characters long',
      'string.max': 'Name must be at most 50 characters long',
      'string.trim': 'Name must not have leading or trailing spaces',
      'string.base': 'Name must be a string',
      'any.required': 'Name is required',
      'string.empty': 'Name cannot be an empty field'
    }),
    price: Joi.number().required().messages({
      'number.base': 'Price must be a number',
      'any.required': 'Price is required',
      'number.empty': 'Price cannot be an empty field'
    }),
    description: Joi.string().required().min(1).trim().strict().messages({
      'string.min': 'Description must be at least 1 characters long',
      'string.trim': 'Description must not have leading or trailing spaces',
      'string.base': 'Description must be a string',
      'any.required': 'Description is required',
      'string.empty': 'Description cannot be an empty field'
    }),
    categoryId: Joi.string().required().messages({
      'string.base': 'Category id must be a string',
      'any.required': 'Category id is required',
      'string.empty': 'Category id cannot be an empty field'
    }),
    quantity: Joi.number().required().min(1).max(999).messages({
      'number.base': 'Quantity must be a number',
      'any.required': 'Quantity is required',
      'number.empty': 'Quantity cannot be an empty field'
    }),
    star: Joi.number().required().min(1).max(5).messages({
      'number.base': 'Star must be a number',
      'any.required': 'Star is required',
      'number.empty': 'Star cannot be an empty field'
    }),
    priceSale: Joi.number().optional().messages({
      'number.base': 'Price sale must be a number',
      'number.empty': 'Price sale cannot be an empty field'
    })
  })
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Image is required')
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

const getProductInParams = async (req: Request, res: Response, next: any) => {
  try {
    const productId = req.params.id
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

const editProductInfo = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    name: Joi.string().required().min(1).max(255).trim().strict(),
    price: Joi.number().required().min(1).max(9999),
    description: Joi.string().required().min(1).trim().strict(),
    categoryId: Joi.string().required(),
    quantity: Joi.number().required().min(1).max(999),
    star: Joi.number().required().min(1).max(5),
    priceSale: Joi.number().min(0).max(9999).default(0),
    _destroy: Joi.boolean().default(false)
  })
  try {
    await check.validateAsync(req.body, { abortEarly: false })
    //validate true -> next sang controller
    next()
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const checkList = async (req: any, res: Response, next: any) => {
  try {
    const productList = req.body.products
    if (productList && productList.length > 0) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'List product is not empty')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const productValidation = {
  createNew,
  getProductInParams,
  editProductInfo,
  checkList
}
