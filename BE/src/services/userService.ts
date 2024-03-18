import bcrypt, { hashSync } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import CryptoJS from 'crypto-js'
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { generateRefreshToken, generateToken, responseData, uploadImage } from '~/utils/algorithms'
import { DEFAULT_AVATAR } from '~/utils/constants'

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
      isConfirmed: false,
      isAdmin: false,
      ...reqBody,
      password: bcrypt.hashSync(reqBody.password),
      emailToken: CryptoJS.lib.WordArray.random(64).toString(CryptoJS.enc.Hex),
      avatar: reqFile ? await uploadImage(reqFile) : DEFAULT_AVATAR
    }
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
    if (data.password) {
      data.password = hashSync(data.password)
    }
    const changeData = {
      ...data,
      updatedAt: Date.now(),
      avatar: reqFile ? await uploadImage(reqFile) : user.avatar
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

const getUsers = async () => {
  try {
    const allUsers = await userModel.getUsers()
    return responseData(allUsers)
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (token: string) => {
  try {
    const user = await userModel.verifyEmail(token)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return responseData(user)
  }
  catch(err) {
    throw err
  }
}
const deleteUserById = async (id: string) => {
  try {
    const user = await userModel.findOneById(id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    await userModel.findAndRemove(id)
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
  deleteUserById
}