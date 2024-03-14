import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/')
  .get((req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: 'user get' })
  })
  .post(userValidation.createNew, userController.createNew)

Router.route('/login').post(userValidation.login, userController.login)

export const userRoute = Router
