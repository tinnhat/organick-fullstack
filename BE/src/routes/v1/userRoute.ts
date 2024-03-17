import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { AdminAuth } from '~/middlewares/adminMiddleware'
import { Auth } from '~/middlewares/authMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.get('/', Auth, AdminAuth, userController.getUsers)

Router.post('/', userValidation.createNew, userController.createNew)

Router.post('/login', userValidation.login, userController.login)

Router.get('/:id', userValidation.getUserInfo, userController.getUserInfo)

Router.put('/:id', Auth, AdminAuth, userValidation.editUserInfo, userController.editUserInfo)

export const userRoute = Router
