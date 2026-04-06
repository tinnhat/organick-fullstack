// ============ FEATURE: reviews START ============
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { validateBeforeCreate } from '../utils/algorithms'
import { getDB } from '../config/mongodb'

const REVIEW_COLLECTION_NAME = 'reviews'
const REVIEW_SCHEMA = Joi.object({
  userId: Joi.required(),
  productId: Joi.required(),
  orderId: Joi.required(),
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().optional().allow(''),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  editDeadline: Joi.date().timestamp('javascript').required(),
  isDeleted: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, REVIEW_SCHEMA)
    const createdReview = await getDB().collection(REVIEW_COLLECTION_NAME).insertOne(validData)
    return createdReview
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByUserAndProduct = async (userId: string, productId: string) => {
  try {
    const result = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        isDeleted: false
      })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
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
      .collection(REVIEW_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true, updatedAt: Date.now() } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getReviewsByProduct = async (productId: string, page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize
    const result = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            productId: new ObjectId(productId),
            isDeleted: false
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            userId: 1,
            productId: 1,
            orderId: 1,
            rating: 1,
            comment: 1,
            createdAt: 1,
            updatedAt: 1,
            editDeadline: 1,
            isDeleted: 1,
            'user.fullname': 1,
            'user.avatar': 1
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

const countReviewsByProduct = async (productId: string) => {
  try {
    const count = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
      .countDocuments({ productId: new ObjectId(productId), isDeleted: false })
    return count
  } catch (error) {
    throw new Error(error as string)
  }
}

const getAverageRating = async (productId: string) => {
  try {
    const result = await getDB()
      .collection(REVIEW_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            productId: new ObjectId(productId),
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' }
          }
        }
      ])
      .toArray()
    return result.length > 0 ? result[0].averageRating : 0
  } catch (error) {
    throw new Error(error as string)
  }
}

export const reviewModel = {
  createNew,
  findOneById,
  findOneByUserAndProduct,
  findAndUpdate,
  findAndRemove,
  getReviewsByProduct,
  countReviewsByProduct,
  getAverageRating,
  REVIEW_COLLECTION_NAME
}
// ============ FEATURE: reviews END ============
