import bcrypt, { hashSync } from 'bcryptjs'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '../models/userModel'
import ApiError from '../utils/ApiError'
import { generateRandomPassword, generateRefreshToken, generateToken, responseData, uploadImage } from '../utils/algorithms'
import { DEFAULT_AVATAR } from '../utils/constants'
import resetPasswordMail from '../utils/mail/resetPasswordEmail'
import sendForgotPasswordEmail from '../utils/mail/sendForgotPasswordEmail'

/* eslint-disable no-useless-catch */
const createNew = async (reqBody: any, reqFile: any) => {
  // co 2 case
  // case reqFile == null => lay avatar default link
  // case reqFile !== null => lay avatar upload len -> check file type, file size -> neu dung -> moi insert new user
  try {
    const userExist = await userModel.findOneByEmail(reqBody.email)
    if (userExist) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }
    const newUser = {
      isConfirmed: true,
      isAdmin: false,
      ...reqBody,
      password: bcrypt.hashSync(reqBody.password),
      avatar: reqFile ? await uploadImage(reqFile, 'organick/users') : DEFAULT_AVATAR
    }
    //insert new user
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    //not show password when response
    delete getNewUser.password
    return responseData(getNewUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody: any) => {
  try {
    const getNewUser = await userModel.findOneByEmail(reqBody.email)
    if (!getNewUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')
    }
    if (getNewUser._destroy) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is deleted, Please contact admin')
    }
    if (!bcrypt.compareSync(reqBody.password, getNewUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect')
    }
    //save refresh token in DB
    await userModel.saveRefreshToken(getNewUser._id, generateRefreshToken(getNewUser))
    //not show password when response
    delete getNewUser.password
    //add access/refresh token
    return responseData({
      user: {
        ...getNewUser,
        refreshToken: generateRefreshToken(getNewUser)
      },
      accessToken: generateToken(getNewUser)
    })
  } catch (error) {
    throw error
  }
}

const getUserInfo = async (userId: string) => {
  try {
    const getNewUser = await userModel.findOneById(userId)
    if (!getNewUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    //not show password when response
    delete getNewUser.password
    return responseData(getNewUser)
  } catch (error) {
    throw error
  }
}

const editUserInfo = async (id: string, data: any, reqFile: any) => {
  try {
    const user = await userModel.findOneById(id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const changeData = {
      ...data,
      updatedAt: Date.now(),
      avatar: reqFile ? await uploadImage(reqFile, 'organick/users') : user.avatar
    }
    await userModel.findAndUpdate(id, changeData)
    //get latest data
    const userUpdated = await userModel.findOneById(id)
    //not show password when response
    delete userUpdated.password
    return responseData(userUpdated)
  } catch (error) {
    throw error
  }
}

const changePassword = async (id: string, data: any) => {
  try {
    const user = await userModel.findOneById(id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    //check password
    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect')
    }
    const changeData = {
      password: hashSync(data.newPassword),
      updatedAt: Date.now()
    }
    await userModel.findAndUpdate(id, changeData)
    //get latest data
    const userUpdated = await userModel.findOneById(id)
    //not show password when response
    delete userUpdated.password
    return responseData(userUpdated)
  } catch (error) {
    throw error
  }
}

const getUsers = async (page: number = 1, pageSize: number = 10) => {
  try {
    const allUsers = await userModel.getUsers(page, pageSize)
    return responseData(allUsers)
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (req: any) => {
  try {
    const user = await userModel.verifyEmail(req)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return responseData(user)
  } catch (err) {
    throw err
  }
}
const deleteUserById = async (id: string) => {
  try {
    const user = await userModel.findOneById(id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const result = await userModel.findAndRemove(id)
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const checkRefreshToken = async (refreshToken: string) => {
  try {
    const user = await userModel.checkRefreshToken(refreshToken)
    if (!user) {
      return null
    }
    const newRefreshToken = generateRefreshToken(user)
    await userModel.updateRefreshToken(user._id, newRefreshToken)
    //not show password when response
    delete user.password
    return responseData({
      user: {
        ...user,
        refreshToken: newRefreshToken
      },
      accessToken: generateToken(user)
    })
    //update lai refresh token moi va access token moi
    // await userModel.findAndRemove(id)
  } catch (error) {
    throw error
  }
}

const resetPassword = async (data: any) => {
  try {
    const user = await userModel.findOneByEmail(data)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const newPassword = generateRandomPassword()

    const result = await userModel.findAndUpdate(user._id, {
      password: hashSync(newPassword),
      updatedAt: Date.now()
    })
    //send email
    await resetPasswordMail(user, newPassword)
    //not show password when response
    delete result.password
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const forgotPassword = async (email: string) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    if (user._destroy) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is deleted, please contact admin')
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordExpires = Date.now() + 3600000

    await userModel.findAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetPasswordExpires,
      updatedAt: Date.now()
    })

    await sendForgotPasswordEmail(user, resetToken)
    return responseData({ message: 'Reset password email sent successfully' })
  } catch (error) {
    throw error
  }
}

const resetPasswordWithToken = async (token: string, newPassword: string) => {
  try {
    const user = await userModel.findOneByResetToken(token)
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired reset token')
    }
    const updatedUser = await userModel.updatePasswordWithToken(token, hashSync(newPassword))
    if (!updatedUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to reset password')
    }
    return responseData({ message: 'Password reset successfully' })
  } catch (error) {
    throw error
  }
}

export const userServices = {
  createNew,
  login,
  getUserInfo,
  editUserInfo,
  getUsers,
  verifyEmail,
  deleteUserById,
  checkRefreshToken,
  changePassword,
  resetPassword,
  forgotPassword,
  resetPasswordWithToken
}
