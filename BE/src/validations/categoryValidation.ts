import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const check = Joi.object({
    name: Joi.string().required().min(1).max(20).trim().strict().messages({
      'string.min': 'Name must be at least 1 characters long',
      'string.max': 'Name must be at most 10 characters long',
      'string.trim': 'Name must not have leading or trailing spaces',
      'string.base': 'Name must be a string',
      'any.required': 'Name is required',
      'string.empty': 'Name cannot be an empty field'
    }),
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

const getCategoryInParams = async (req: Request, res: Response, next: any) => {
  try {
    const categoryId = req.params.id
    if (categoryId) {
      next()
    } else {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Category id is required')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const editCategoryInfo = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    name: Joi.string().optional().min(1).max(20).trim().strict(),
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

export const categoryValidation = {
  createNew,
  getCategoryInParams,
  editCategoryInfo
}
