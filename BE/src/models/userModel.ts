import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_SCHEMA = Joi.object({
  fullname: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().required().email().trim().strict(),
  password: Joi.string().required().min(6).max(255).trim().strict(),
  isConfirmed: Joi.boolean().valid(true, false).required(),
  isAdmin: Joi.boolean().valid(true, false).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  refreshToken: Joi.string(),
  emailToken: Joi.string(),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data: any) => {
  return await USER_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data)
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
    const result = await getDB().collection(USER_COLLECTION_NAME).find({}).toArray()
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const verifyEmail = async (token: string) => {
  try {
    const result = await getDB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ emailToken:token }, { $set: { isConfirmed: true } })
    return result
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

export const userModel = {
  createNew,
  findOneById,
  findOneByEmail,
  findAndUpdate,
  saveRefreshToken,
  getUsers,
  verifyEmail,
  findAndRemove
}
