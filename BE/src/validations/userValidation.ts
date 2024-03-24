import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { Request, Response } from 'express'
import { checkPermission } from '~/utils/algorithms'

//validate data neu bi loi se quang loi , neu ok -> chuyen data sang controller
const createNew = async (req: Request, res: Response, next: any) => {
  const check = Joi.object({
    fullname: Joi.string().required().min(3).max(50).trim().strict().messages({
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name must be at most 50 characters long',
      'string.trim': 'Full name must not have leading or trailing spaces',
      'string.base': 'Full name must be a string',
      'any.required': 'Full name is required',
      'string.empty': 'Full name cannot be an empty field'
    }),
    email: Joi.string().required().email().trim().strict().messages({
      'string.email': 'Email must be a valid email',
      'string.base': 'Email must be a string',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be an empty field'
    }),
    password: Joi.string().required().min(6).max(50).trim().strict().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be at most 50 characters long',
      'string.trim': 'Password must not have leading or trailing spaces',
      'string.base': 'Password must be a string',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be an empty field'
    }),
    isConfirmed: Joi.boolean().valid(true, false).messages({
      'any.required': 'isConfirmed is required',
      'any.only': 'isConfirmed must be true'
    }),
    isAdmin: Joi.boolean().valid(true, false).messages({
      'any.required': 'isAdmin is required',
      'any.only': 'isAdmin must be true'
    })
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

const login = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    email: Joi.string().required().email().trim().strict().messages({
      'string.email': 'Email must be a valid email',
      'string.base': 'Email must be a string',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be an empty field'
    }),
    password: Joi.string().required().min(6).max(50).trim().strict().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be at most 50 characters long',
      'string.trim': 'Password must not have leading or trailing spaces',
      'string.base': 'Password must be a string',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be an empty field'
    })
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

const getUserInParams = async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id
    if (userId) {
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

const editUserInfo = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    fullname: Joi.string().optional().min(3).max(50).trim().strict(),
    file: Joi.any().optional()
  })
  try {
    if (checkPermission(req.user, req.params.id)) {
      await check.validateAsync(req.body, { abortEarly: false })
      //validate true -> next sang controller

      next()
    } else {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Permission denied')
    }
  } catch (error) {
    const errorMessage = new Error(String(error)).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const verifyEmail = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    emailToken: Joi.string().required().messages({
      'string.base': 'Email token must be a string',
      'any.required': 'Email token is required'
    })
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

const changePassword = async (req: any, res: Response, next: any) => {
  const check = Joi.object({
    password: Joi.string().required().messages({
      'string.base': 'password must be a string',
      'any.required': 'password is required'
    }),
    newPassword: Joi.string().required().messages({
      'string.base': 'newPassword must be a string',
      'any.required': 'newPassword is required'
    })
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

export const userValidation = {
  createNew,
  login,
  getUserInParams,
  editUserInfo,
  verifyEmail,
  changePassword
}
