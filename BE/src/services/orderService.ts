import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { orderModel } from '~/models/orderModel'
import { productModel } from '~/models/productModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { responseData } from '~/utils/algorithms'
/* eslint-disable no-useless-catch */

const createNew = async (reqBody: any) => {
  try {
    //check xem co user hay khong
    const userExist = await userModel.findOneById(reqBody.userId)
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    //check xem product co ton tai hay khong

    for (let i = 0; i < reqBody.listProducts.length; i++) {
      const product = await productModel.findOneById(reqBody.listProducts[i].id)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      } else {
        //co product -> check so luong
        if (product.quantity < reqBody.listProducts[i].quantity) {
          throw new ApiError(StatusCodes.NOT_FOUND, `Quantity of product: "${product.name}" in stock is not enough`)
        }
      }
    }
    const createdOrder = await orderModel.createNew({
      ...reqBody,
      status: 'Pending',
      userId: new ObjectId(reqBody.userId)
    })
    //update product quantity in stock
    for (let i = 0; i < reqBody.listProducts.length; i++) {
      const product = await productModel.findOneById(reqBody.listProducts[i])
      const newQuantity = product.quantity - reqBody.listProducts[i].quantity
      await productModel.findAndUpdate(reqBody.listProducts[i], { quantity: newQuantity })
    }
    const getOrder = await orderModel.findOneById(createdOrder.insertedId)
    return responseData(getOrder)
  } catch (error) {
    throw error
  }
}

const getOrders = async () => {
  try {
    const allOrder = await orderModel.getOrders()
    return responseData(allOrder)
  } catch (error) {
    throw error
  }
}

const getOrderInfo = async (orderId: string) => {
  try {
    const getOrder = await orderModel.findOneById(orderId)
    if (!getOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    //get detail product
    const listProducts = []
    for (let i = 0; i < getOrder.listProducts.length; i++) {
      const product = await productModel.findOneById(getOrder.listProducts[i])
      listProducts.push({ ...product, quantityInOrder: getOrder.listProducts[i].quantity })
    }
    return responseData({ ...getOrder, listProducts })
  } catch (error) {
    throw error
  }
}

const editOrderInfo = async (id: string, data: any) => {
  try {
    const order = await orderModel.findOneById(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    const oldListProducts = order.listProducts
    // check quanity in stock co du hay khong
   
    //remove list product has quantity: 0
    data.listProducts = data.listProducts.filter((item: any) => item.quantity > 0)

    const changeData = {
      ...data,
      updatedAt: Date.now()
    }
    await orderModel.findAndUpdate(id, changeData)
    //get latest data
    const orderUpdated = await orderModel.findOneById(id)
    return responseData(orderUpdated)
  } catch (error) {
    throw error
  }
}

const deleteOrderById = async (id: string) => {
  try {
    const category = await orderModel.findOneById(id)
    // check trong product co dang su dung category nay k
    // co 2 case:
    // case 1: product con hang va dang su dung category nay -> se thong bao khong xoa dc do product con hang va product van dang active
    // case 2: product khong con hang va dang su dung category nay -> se khong xoa dc neu product dang active ( neu k active co the xoa dc)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    await orderModel.findAndRemove(id)
  } catch (error) {
    throw error
  }
}

export const orderServices = {
  createNew,
  getOrders,
  getOrderInfo,
  editOrderInfo,
  deleteOrderById
}
