import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { DEFAULT_AVATAR } from '../utils/constants'
import { validateBeforeCreate } from '../utils/algorithms'
import { getDB } from '../config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_SCHEMA = Joi.object({
  fullname: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().required().email().trim().strict(),
  password: Joi.string().required().min(6).max(255).trim().strict(),
  isConfirmed: Joi.boolean().valid(true, false).required(),
  isAdmin: Joi.boolean().valid(true, false).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  avatar: Joi.string().uri().default(DEFAULT_AVATAR),
  refreshToken: Joi.string(),
  emailToken: Joi.string(),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    delete data.file
    const validData = await validateBeforeCreate(data, USER_SCHEMA)
    const createdUser = await getDB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByEmail = async (email: string) => {
  try {
    const result = await getDB().collection(USER_COLLECTION_NAME).findOne({ email })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(userId) }, { $set: { refreshToken } })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getUsers = async () => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .aggregate([{ $sort: { _destroy: 1 } }])
      .toArray()
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const verifyEmail = async (data: any) => {
  try {
    const user = await await getDB().collection(USER_COLLECTION_NAME).findOne({ emailToken: data.emailToken })
    if (user) {
      if (user.isConfirmed) {
        throw new Error('Email already confirmed')
      }
      await getDB()
        .collection(USER_COLLECTION_NAME)
        .updateOne({ emailToken: data.emailToken }, { $set: { isConfirmed: true, emailToken: null } })
      //not show password when response
      delete user.password
      return {
        ...user,
        isConfirmed: true,
        emailToken: null
      }
    } else {
      throw new Error('Email verification failed, invalid token')
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndRemove = async (id: string) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { _destroy: true } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const checkRefreshToken = async (refreshToken: string) => {
  try {
    const user = await await getDB().collection(USER_COLLECTION_NAME).findOne({ refreshToken })
    if (!user) return null
    return user
  } catch (error) {
    throw new Error(error as string)
  }
}

const updateRefreshToken = async (userId: string, newRefreshToken: string) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(userId) }, { $set: { refreshToken: newRefreshToken } })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const userModel = {
  createNew,
  findOneById,
  findOneByEmail,
  findAndUpdate,
  saveRefreshToken,
  getUsers,
  verifyEmail,
  findAndRemove,
  checkRefreshToken,
  updateRefreshToken,
  USER_COLLECTION_NAME
}
