import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Auth } from '../../middlewares/authMiddleware'
import { AdminAuth } from '../../middlewares/adminMiddleware'
import { userController } from '../../controllers/userController'
import { userValidation } from '../../validations/userValidation'


const Router = express.Router()

Router.get('/', Auth, AdminAuth, userController.getUsers)

//register or create user
Router.post('/', userValidation.createNew, userController.createNew)

//verify
Router.post('/verify-email', userValidation.verifyEmail, userController.verifyEmail)

//change password
Router.put('/change-password/:id', Auth, userValidation.changePassword, userController.changePassword)

//reset password (admin only)
Router.post('/reset-password', Auth, AdminAuth, userValidation.resetPassword, userController.resetPassword)

//forgot password (public)
Router.post('/forgot-password', userValidation.forgotPassword, userController.forgotPassword)

//reset password with token (public)
Router.post('/reset-password-with-token', userValidation.resetPasswordWithToken, userController.resetPasswordWithToken)

//login
Router.post('/login', userValidation.login, userController.login)

//get user by id
Router.get('/:id', Auth, userValidation.getUserInParams, userController.getUserInfo)

//edit user by id
Router.put('/:id', Auth, userValidation.editUserInfo, userController.editUserInfo)

//delete user by id
Router.delete('/:id', Auth, AdminAuth, userValidation.getUserInParams, userController.deleteUserById)

export const userRoute = Router
