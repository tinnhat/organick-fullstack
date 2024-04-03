import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { validateBeforeCreate } from '~/utils/algorithms'
import { categoryModel } from './categoryModel'

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(255).trim().strict(),
  description: Joi.string().required().min(1).trim().strict(),
  image: Joi.string().required().uri().trim().strict(),
  price: Joi.number().required().min(1).max(9999),
  priceSale: Joi.number().min(0).max(9999).default(0),
  quantity: Joi.number().required().min(1).max(999),
  star: Joi.number().required().min(1).max(5),
  slug: Joi.string().required().min(1).max(255).trim().strict(),
  categoryId: Joi.required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, PRODUCT_SCHEMA)
    const createdCategory = await getDB().collection(PRODUCT_COLLECTION_NAME).insertOne(validData)
    return createdCategory
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByName = async (name: string) => {
  try {
    const result = await getDB().collection(PRODUCT_COLLECTION_NAME).findOne({ name })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

//tra them category name xai aggregate
const findOneById = async (id: string) => {
  try {
    const result = await getDB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        {
          $match: { _id: new ObjectId(id) }
        },
        {
          $lookup: {
            from: categoryModel.CATEGORY_COLLECTION_NAME,
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        }
      ])
      .toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error as string)
  }
}

//tra them category name xai aggregate
const getProducts = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize
    let result: any = []
    if (!isNaN(skip) && pageSize) {
      result = await getDB()
        .collection(PRODUCT_COLLECTION_NAME)
        .aggregate([
          {
            $lookup: {
              from: categoryModel.CATEGORY_COLLECTION_NAME,
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          },
          { $skip: skip },
          { $limit: pageSize },
          { $sort: { _destroy: 1 } }
        ])
        .toArray()
    } else {
      result = await getDB()
        .collection(PRODUCT_COLLECTION_NAME)
        .aggregate([
          {
            $lookup: {
              from: categoryModel.CATEGORY_COLLECTION_NAME,
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          },
          { $sort: { _destroy: 1 } }
        ])
        .toArray()
    }

    if (!result) return null
    return result || null
  } catch (error) {
    throw new Error(error as string)
  }
}

const getProductsByName = async (name: string) => {
  try {
    const result = await getDB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: categoryModel.CATEGORY_COLLECTION_NAME,
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $sort: { _destroy: 1 } },
        {
          $match: { name: new RegExp(name, 'i') }
        }
      ])
      .toArray()

    if (!result) return null
    return result || null
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAndUpdate = async (id: string, data: any) => {
  try {
    const result = await getDB()
      .collection(PRODUCT_COLLECTION_NAME)
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
      .collection(PRODUCT_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { _destroy: true } })
    if (!result) return null
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

export const productModel = {
  createNew,
  findOneById,
  getProducts,
  getProductsByName,
  findAndRemove,
  findAndUpdate,
  findOneByName
}
