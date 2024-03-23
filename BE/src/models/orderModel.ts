import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { validateBeforeCreate } from '~/utils/algorithms'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_SCHEMA = Joi.object({
  address: Joi.string().required().min(0).max(255).trim().strict(),
  phone: Joi.string().required().min(0).max(255).trim().strict(),
  note: Joi.string().max(255).trim().strict(),
  userId: Joi.required(),
  listProducts: Joi.array().required(),
  totalPrice: Joi.number().required().min(1).max(9999),
  status: Joi.string().required(),
  isPaid: Joi.boolean().default(false),
  listProductsWaiting: Joi.array().default([]),
  stripeCheckoutLink: Joi.string().default('').optional(),
  checkOutSessionId: Joi.string().default('').optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, ORDER_SCHEMA)
    const createdProduct = await getDB().collection(ORDER_COLLECTION_NAME).insertOne(validData)
    return createdProduct
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneBySessionId = async (id: string) => {
  try {

    const result = await getDB().collection(ORDER_COLLECTION_NAME).findOne({ checkOutSessionId: id })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getOrders = async () => {
  try {
    const result = await getDB().collection(ORDER_COLLECTION_NAME).find({}).toArray()
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(ORDER_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndRemove = async (id: string) => {
  try {
    const result = await getDB()
      .collection(ORDER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { _destroy: true } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const orderModel = {
  createNew,
  findOneById,
  findOneBySessionId,
  getOrders,
  findAndRemove,
  findAndUpdate
}
