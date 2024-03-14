import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdUser = await userServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const login = async (req: Request, res: Response, next: any) => {
  try {
    const createdUser = await userServices.login(req.body)
    res.status(StatusCodes.OK).json(createdUser)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getUserInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.getUserInfo(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const editUserInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.editUserInfo(req.params.id, req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const userController = {
  createNew,
  login,
  getUserInfo,
  editUserInfo,
}
