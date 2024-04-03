import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '../../controllers/userController'
import { AdminAuth } from '../../middlewares/adminMiddleware'
import { Auth } from '../../middlewares/authMiddleware'
import { userValidation } from '../../validations/userValidation'

const Router = express.Router()

Router.get('/', Auth, AdminAuth, userController.getUsers)

//register or create user
Router.post('/', userValidation.createNew, userController.createNew)

//verify
Router.post('/verify-email', userValidation.verifyEmail, userController.verifyEmail)

//change password
Router.put('/change-password/:id', Auth, userValidation.changePassword, userController.changePassword)

//reset password
Router.post('/reset-password', Auth, AdminAuth, userValidation.resetPassword, userController.resetPassword)

//login
Router.post('/login', userValidation.login, userController.login)

//get user by id
Router.get('/:id', Auth, userValidation.getUserInParams, userController.getUserInfo)

//edit user by id
Router.put('/:id', Auth, userValidation.editUserInfo, userController.editUserInfo)

//delete user by id
Router.delete('/:id', Auth, AdminAuth, userValidation.getUserInParams, userController.deleteUserById)

export const userRoute = Router
