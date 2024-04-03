import { StatusCodes } from 'http-status-codes'
import { categoryModel } from '../models/categoryModel'
import ApiError from '../utils/ApiError'
import { responseData } from '../utils/algorithms'
/* eslint-disable no-useless-catch */

const createNew = async (reqBody: any) => {
  try {
    const checkCategory = await categoryModel.findOneByName(reqBody.name)
    if (checkCategory) {
      throw new Error('Category already exists')
    }
    const createdCategory = await categoryModel.createNew(reqBody)
    const getCategory = await categoryModel.findOneById(createdCategory.insertedId)
    return responseData(getCategory)
  } catch (error) {
    throw error
  }
}

const getCategories = async () => {
  try {
    const allCategories = await categoryModel.getCategories()
    return responseData(allCategories)
  } catch (error) {
    throw error
  }
}

const getCategoryInfo = async (categoryId: string) => {
  try {
    const getCategory = await categoryModel.findOneById(categoryId)
    if (!getCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return responseData(getCategory)
  } catch (error) {
    throw error
  }
}

const editCategoryInfo = async (id: string, data: any) => {
  try {
    const category = await categoryModel.findOneById(id)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    const changeData = {
      ...data,
      updatedAt: Date.now()
    }
    await categoryModel.findAndUpdate(id, changeData)
    //get latest data
    const categoryUpdated = await categoryModel.findOneById(id)
    return responseData(categoryUpdated)
  } catch (error) {
    throw error
  }
}

const deleteCategoryById = async (id: string) => {
  try {
    const category = await categoryModel.findOneById(id)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    const result = await categoryModel.findAndRemove(id)
    return responseData(result)
  } catch (error) {
    throw error
  }
}

export const categoryServices = {
  createNew,
  getCategories,
  getCategoryInfo,
  editCategoryInfo,
  deleteCategoryById
}
