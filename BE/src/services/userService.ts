import { userModel } from '~/models/userModel'
import bcrypt, { hashSync } from 'bcryptjs'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { generateRefreshToken, generateToken } from '~/utils/algorithms'
/* eslint-disable no-useless-catch */

const createNew = async (reqBody: any) => {
  try {
    const newUser = {
      isConfirmed: false,
      isAdmin: false,
      ...reqBody,
      password: bcrypt.hashSync(reqBody.password)
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    //not show password when response
    delete getNewUser.password
    return getNewUser
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
    //add access/refresh token
    return {
      user: getNewUser,
      accessToken: generateToken(getNewUser),
      refreshToken: generateRefreshToken(getNewUser)
    }
  } catch (error) {
    throw error
  }
}

export const userServices = {
  createNew,
  login
}
