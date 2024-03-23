import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderServices } from '~/services/orderService'
import { productServices } from '~/services/productService'

const createNew = async (req: Request, res: Response, next: any) => {
  try {
    const createdOrder = await orderServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdOrder)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getOrders = async (req: Request, res: Response, next: any) => {
  try {
    const orders = await orderServices.getOrders()
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getOrdersByUser = async (req: Request, res: Response, next: any) => {
  try {
    const orders = await orderServices.getOrdersByUser(req.params.id)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const getOrderInfo = async (req: Request, res: Response, next: any) => {
  try {
    const order = await orderServices.getOrderInfo(req.params.id)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const editOrderInfo = async (req: Request, res: Response, next: any) => {
  try {
    const order = await orderServices.editOrderInfo(req.params.id, req.body)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

const updateOrderInfo = async (req: Request, res: Response, next: any) => {
  try {
    const order = await orderServices.updateOrderInfo(req.params.id, req.body)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}


const deleteOrderById = async (req: Request, res: Response, next: any) => {
  try {
    const product = await orderServices.deleteOrderById(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const orderController = {
  createNew,
  getOrders,
  getOrderInfo,
  editOrderInfo,
  updateOrderInfo,
  deleteOrderById,
  getOrdersByUser
}
