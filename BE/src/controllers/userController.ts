import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userServices } from '../services/userService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdUser = await userServices.createNew(req.body, req.file)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: any) => {
  try {
    const createdUser = await userServices.login(req.body)
    res.status(StatusCodes.OK).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getUserInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.getUserInfo(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const editUserInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.editUserInfo(req.params.id, req.body, req.file)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const deleteUserById = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.deleteUserById(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.getUsers()
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const verifyEmail = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.verifyEmail(req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.changePassword(req.params.id, req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userServices.resetPassword(req.body.email)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  login,
  getUserInfo,
  editUserInfo,
  getUsers,
  verifyEmail,
  deleteUserById,
  changePassword,
  resetPassword
}
