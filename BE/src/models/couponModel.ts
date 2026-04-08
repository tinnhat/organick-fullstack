import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { validateBeforeCreate } from '../utils/algorithms'
import { getDB } from '../config/mongodb'

const COUPON_COLLECTION_NAME = 'coupons'
const COUPON_SCHEMA = Joi.object({
  code: Joi.string().required().min(1).max(50).trim().strict(),
  type: Joi.string().required().valid('percentage', 'fixed'),
  value: Joi.number().required().min(0),
  minOrderAmount: Joi.number().min(0).default(0),
  maxUses: Joi.number().allow(null).default(null),
  usedBy: Joi.array()
    .items(
      Joi.object({
        userId: Joi.required(),
        usedAt: Joi.date().timestamp('javascript').default(Date.now)
      })
    )
    .default([]),
  expiresAt: Joi.date().timestamp('javascript').required(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, COUPON_SCHEMA)
    const createdCoupon = await getDB().collection(COUPON_COLLECTION_NAME).insertOne(validData)
    return createdCoupon
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByCode = async (code: string) => {
  try {
    const result = await getDB().collection(COUPON_COLLECTION_NAME).findOne({ code: code.toUpperCase() })
    return result || null
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(COUPON_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result || null
  } catch (error) {
    throw new Error(error as string)
  }
}

const getCoupons = async (filters: any = {}, page: number = 1, pageSize: number = 10) => {
  try {
    const skip = (page - 1) * pageSize
    const query: any = { _destroy: false }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive
    }
    if (filters.type) {
      query.type = filters.type
    }

    const result = await getDB().collection(COUPON_COLLECTION_NAME).find(query).skip(skip).limit(pageSize).toArray()

    const total = await getDB().collection(COUPON_COLLECTION_NAME).countDocuments(query)

    return {
      coupons: result,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(COUPON_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: Date.now() } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const atomicApplyCoupon = async (
  code: string,
  userId: ObjectId,
  orderAmount: number,
  minOrderAmount: number,
  maxUses: number | null,
  expiresAt: Date,
  userIdString: string
) => {
  try {
    const now = new Date()
    const query: any = {
      code,
      isActive: true,
      _destroy: false,
      expiresAt: { $gt: now },
      minOrderAmount: { $lte: orderAmount },
      usedBy: {
        $not: {
          $elemMatch: { userId: userId }
        }
      }
    }

    if (maxUses !== null) {
      query.$expr = { $lt: [{ $size: '$usedBy' }, maxUses] }
    }

    const result = await getDB()
      .collection(COUPON_COLLECTION_NAME)
      .findOneAndUpdate(
        query,
        {
          $push: {
            usedBy: { userId, usedAt: now }
          },
          $set: { updatedAt: now }
        },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndRemove = async (id: string) => {
  try {
    const result = await getDB()
      .collection(COUPON_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { _destroy: true, updatedAt: Date.now() } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const couponModel = {
  createNew,
  findOneByCode,
  findOneById,
  getCoupons,
  findAndUpdate,
  findAndRemove,
  atomicApplyCoupon,
  COUPON_COLLECTION_NAME
}
