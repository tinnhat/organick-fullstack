import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productServices } from '~/services/productService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdProduct = await productServices.createNew(req.body, req.file)
    res.status(StatusCodes.CREATED).json(createdProduct)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getProducts = async (req: Request, res: Response, next: any) => {
  try {
    const products = await productServices.getProducts()
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getProductInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await productServices.getProductInfo(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const editProductInfo = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productServices.editProductInfo(req.params.id, req.body, req.file)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const deleteProductById = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productServices.deleteProductById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const productController = {
  createNew,
  getProducts,
  getProductInfo,
  editProductInfo,
  deleteProductById
}
