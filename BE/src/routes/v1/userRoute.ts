import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { AdminAuth } from '~/middlewares/adminMiddleware'
import { Auth } from '~/middlewares/authMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'user get' })
})

//register or create user
Router.post('/', userValidation.createNew, userController.createNew)

//login
Router.post('/login', userValidation.login, userController.login)

//get user by id
Router.get('/:id', Auth, userValidation.getUserInParams, userController.getUserInfo)

//edit user by id
Router.put('/:id', Auth, userValidation.editUserInfo, userController.editUserInfo)

//delete user by id
Router.delete('/:id', Auth, AdminAuth, userValidation.getUserInParams, userController.deleteUserById)

export const userRoute = Router
