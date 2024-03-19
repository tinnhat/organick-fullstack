import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { validateBeforeCreate } from '~/utils/algorithms'

const CATEGORY_COLLECTION_NAME = 'categories'
const CATEGORY_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(20).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, CATEGORY_SCHEMA)
    const createdCategory = await getDB().collection(CATEGORY_COLLECTION_NAME).insertOne(validData)
    return createdCategory
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByName = async (name: string) => {
  try {
    const result = await getDB().collection(CATEGORY_COLLECTION_NAME).findOne({ name })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getCategories = async () => {
  try {
    const result = await getDB().collection(CATEGORY_COLLECTION_NAME).find({}).toArray()
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(CATEGORY_COLLECTION_NAME)
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
      .collection(CATEGORY_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { _destroy: true } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const categoryModel = {
  createNew,
  findOneByName,
  findOneById,
  getCategories,
  findAndRemove,
  findAndUpdate
}
