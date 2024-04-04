import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productServices } from '../services/productService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdProduct = await productServices.createNew(req.body, req.file)
    res.status(StatusCodes.CREATED).json(createdProduct)
  } catch (error) {
    next(error)
  }
}

const getProducts = async (req: Request, res: Response, next: any) => {
  try {
    const page = Number(req.query.page)
    const pageSize = Number(req.query.pageSize)
    const products = await productServices.getProducts(page, pageSize)
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const getProductsByName = async (req: Request, res: Response, next: any) => {
  try {
    const name = req.query.name!.toString()
    const products = await productServices.getProductsByName(name)
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const getProductInfo = async (req: Request, res: Response, next: any) => {
  try {
    const user = await productServices.getProductInfo(req.params.id)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const editProductInfo = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productServices.editProductInfo(req.params.id, req.body, req.file)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const deleteProductById = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productServices.deleteProductById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const checkList = async (req: Request, res: Response, next: any) => {
  try {
    const product = await productServices.checkList(req.body)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

export const productController = {
  createNew,
  getProducts,
  getProductInfo,
  editProductInfo,
  deleteProductById,
  checkList,
  getProductsByName
}
