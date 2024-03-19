import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { categoryServices } from '~/services/categoryService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdCategory = await categoryServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCategory)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getCategories = async (req: Request, res: Response, next: any) => {
  try {
    const categories = await categoryServices.getCategories()
    res.status(StatusCodes.OK).json(categories)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getCategoryInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await categoryServices.getCategoryInfo(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const editCategoryInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await categoryServices.editCategoryInfo(req.params.id, req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const deleteCategoryById = async (req: Request, res: Response, next: any) => {
  try {
    const user = await categoryServices.deleteCategoryById(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const categoryController = {
  createNew,
  getCategories,
  getCategoryInfo,
  editCategoryInfo,
  deleteCategoryById
}
