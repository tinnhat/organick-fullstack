import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_SCHEMA = Joi.object({
  address: Joi.string().required().min(1).max(255).trim().strict(),
  phone: Joi.string().required().min(1).max(255).trim().strict(),
  note: Joi.string().max(255).trim().strict(),
  userId: Joi.string().required(),
  listProducts: Joi.array().required(),
  totalPrice: Joi.number().required().min(1).max(9999),
  status: Joi.number().required().min(0).max(2),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})
