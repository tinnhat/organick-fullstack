// ============ FEATURE: notifications START ============
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { validateBeforeCreate } from '../utils/algorithms'
import { getDB } from '../config/mongodb'

const NOTIFICATION_COLLECTION_NAME = 'notifications'
const NOTIFICATION_SCHEMA = Joi.object({
  userId: Joi.required(),
  type: Joi.string().required().valid('order', 'chat', 'review'),
  title: Joi.string().required().min(1).max(255).trim().strict(),
  message: Joi.string().required().min(1).max(1000).trim().strict(),
  data: Joi.object().optional(),
  isRead: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, NOTIFICATION_SCHEMA)
    const createdNotification = await getDB().collection(NOTIFICATION_COLLECTION_NAME).insertOne(validData)
    return createdNotification
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: Date.now() } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndRemove = async (id: string) => {
  try {
    const result = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getUserNotifications = async (userId: string, page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize
    const result = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId)
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize }
      ])
      .toArray()
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const countUserNotifications = async (userId: string) => {
  try {
    const count = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .countDocuments({ userId: new ObjectId(userId) })
    return count
  } catch (error) {
    throw new Error(error as string)
  }
}

const countUnreadNotifications = async (userId: string) => {
  try {
    const count = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .countDocuments({ userId: new ObjectId(userId), isRead: false })
    return count
  } catch (error) {
    throw new Error(error as string)
  }
}

const markAllAsRead = async (userId: string) => {
  try {
    const result = await getDB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .updateMany({ userId: new ObjectId(userId), isRead: false }, { $set: { isRead: true, updatedAt: Date.now() } })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const notificationModel = {
  createNew,
  findOneById,
  findAndUpdate,
  findAndRemove,
  getUserNotifications,
  countUserNotifications,
  countUnreadNotifications,
  markAllAsRead,
  NOTIFICATION_COLLECTION_NAME
}
// ============ FEATURE: notifications END ============
