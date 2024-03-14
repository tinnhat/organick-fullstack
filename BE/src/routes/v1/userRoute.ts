import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { Auth } from '~/middlewares/authMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'user get' })
})

Router.post('/', userValidation.createNew, userController.createNew)

Router.post('/login', userValidation.login, userController.login)

Router.get('/:id', userValidation.getUserInfo, userController.getUserInfo)

Router.put('/:id', Auth, userValidation.editUserInfo, userController.editUserInfo)

export const userRoute = Router
