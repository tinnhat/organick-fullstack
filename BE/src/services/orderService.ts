import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId, ClientSession } from 'mongodb'
import { isAfter } from 'date-fns'
/* eslint-disable no-useless-catch */
import stripePackage from 'stripe'
import { getDB } from '../config/mongodb'
import { userModel } from '../models/userModel'
import ApiError from '../utils/ApiError'
import { productModel } from '../models/productModel'
import { orderModel } from '../models/orderModel'
import { couponModel } from '../models/couponModel'
import { responseData } from '../utils/algorithms'
import { env } from '../config/environment'
import moment from 'moment'
import { notificationService } from './notificationService'

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!)

const calculateDiscount = async (couponCode: string, orderAmount: number, userId: string) => {
  const coupon = await couponModel.findOneByCode(couponCode)
  if (!coupon) {
    return { valid: false, discountAmount: 0 }
  }
  if (!coupon.isActive || coupon._destroy) {
    return { valid: false, discountAmount: 0 }
  }
  if (isAfter(new Date(), new Date(coupon.expiresAt))) {
    return { valid: false, discountAmount: 0 }
  }
  if (orderAmount < coupon.minOrderAmount) {
    return { valid: false, discountAmount: 0 }
  }
  if (coupon.maxUses !== null && coupon.usedBy.length >= coupon.maxUses) {
    return { valid: false, discountAmount: 0 }
  }
  const alreadyUsed = coupon.usedBy.some((use: any) => use.userId.toString() === userId.toString())
  if (alreadyUsed) {
    return { valid: false, discountAmount: 0 }
  }

  let discountAmount = 0
  if (coupon.type === 'percentage') {
    discountAmount = (orderAmount * coupon.value) / 100
  } else {
    discountAmount = coupon.value
  }
  discountAmount = Math.min(discountAmount, orderAmount)

  return {
    valid: true,
    discountAmount,
    couponId: coupon._id
  }
}

const findAdminUser = async () => {
  const { users } = await userModel.getUsers()
  const admin = users.find((u: any) => u.isAdmin === true)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin user not found')
  }
  return admin
}

const getActiveProducts = async () => {
  const products = await stripe.products.list()
  const availableProducts = products.data.filter((product: any) => product.active)
  return availableProducts
}

const createNew = async (reqBody: any) => {
  const originalQuantities: { productId: string; originalQty: number }[] = []
  try {
    const userExist = await userModel.findOneById(reqBody.userId)
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    let discountAmount = 0
    let couponId: ObjectId | null = null
    const couponCode = reqBody.couponCode || null

    if (couponCode) {
      const discountResult = await calculateDiscount(couponCode, reqBody.totalPrice, reqBody.userId)
      if (!discountResult.valid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired coupon')
      }
      discountAmount = discountResult.discountAmount
      couponId = discountResult.couponId ? new ObjectId(discountResult.couponId) : null
    }

    const listProducts = reqBody.listProducts.map((item: any) => ({
      _id: new ObjectId(item._id),
      quantityAddtoCart: item.quantityAddtoCart,
      price: item.price,
      name: item.name
    }))

    for (let i = 0; i < listProducts.length; i++) {
      const product = await productModel.findOneById(listProducts[i]._id.toString())
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      }
      if (product.quantity < listProducts[i].quantityAddtoCart) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Quantity of product: "${product.name}" in stock is not enough`)
      }
      originalQuantities.push({ productId: listProducts[i]._id.toString(), originalQty: product.quantity })
    }

    const createdOrder = await orderModel.createNew({
      ...reqBody,
      status: 'Pending',
      userId: new ObjectId(reqBody.userId),
      couponId,
      couponCode,
      discountAmount,
      listProducts
    })

    for (let i = 0; i < listProducts.length; i++) {
      const product = await productModel.findOneById(listProducts[i]._id.toString())
      const newQuantity = product.quantity - listProducts[i].quantityAddtoCart
      await productModel.findAndUpdate(listProducts[i]._id.toString(), { quantity: newQuantity })
    }

    const getOrder = await orderModel.findOneById(createdOrder.insertedId)

    const adminUser = await findAdminUser()
    if (adminUser) {
      await notificationService.createNotification(
        adminUser._id.toString(),
        'order',
        'New Order Received',
        `You have a new order from ${getOrder[0].userId?.fullname || 'a user'}`,
        { orderId: createdOrder.insertedId.toString() }
      )
    }

    return responseData(getOrder)
  } catch (error) {
    for (const { productId, originalQty } of originalQuantities) {
      await productModel.findAndUpdate(productId, { quantity: originalQty })
    }
    throw error
  }
}

const createNewByAdmin = async (reqBody: any) => {
  const originalQuantities: { productId: string; originalQty: number }[] = []
  try {
    const userExist = await userModel.findOneById(reqBody.userId)
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    let discountAmount = 0
    let couponId: ObjectId | null = null
    const couponCode = reqBody.couponCode || null

    if (couponCode) {
      const discountResult = await calculateDiscount(couponCode, reqBody.totalPrice, reqBody.userId)
      if (!discountResult.valid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired coupon')
      }
      discountAmount = discountResult.discountAmount
      couponId = discountResult.couponId ? new ObjectId(discountResult.couponId) : null
    }

    const listProducts = reqBody.listProducts.map((item: any) => ({
      _id: new ObjectId(item._id),
      quantityAddtoCart: item.quantityAddtoCart,
      price: item.price,
      name: item.name
    }))

    for (let i = 0; i < listProducts.length; i++) {
      const product = await productModel.findOneById(listProducts[i]._id.toString())
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      }
      if (product.quantity < listProducts[i].quantityAddtoCart) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Quantity of product: "${product.name}" in stock is not enough`)
      }
      originalQuantities.push({ productId: listProducts[i]._id.toString(), originalQty: product.quantity })
    }
    let activeProducts = await getActiveProducts()
    try {
      for (const product of listProducts) {
        const stripeProduct = activeProducts.find((activeProduct: any) => activeProduct.id === product._id.toString())
        if (stripeProduct === undefined) {
          await stripe.products.create({
            id: product._id.toString(),
            active: true,
            name: product.name,
            description: product.description,
            default_price_data: {
              unit_amount: product.price * 100,
              currency: 'usd'
            },
            images: [product.image],
            url: product.slug
          })
        }
      }
    } catch (error) {
      console.log('error: ', error)
    }
    activeProducts = await getActiveProducts()
    const stripeItems: any = []
    for (const product of listProducts) {
      const stripeProduct = activeProducts.find((activeProduct: any) => activeProduct.id === product._id.toString())

      if (stripeProduct) {
        await stripeItems.push({
          price: stripeProduct.default_price,
          quantity: product.quantityAddtoCart
        })
      }
    }
    const session = await stripe.checkout.sessions.create({
      customer_email: userExist.email,
      line_items: stripeItems,
      mode: 'payment',
      success_url: `${env.HOST_FE}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.HOST_FE}/pending?session_id={CHECKOUT_SESSION_ID}`,
      custom_fields: [
        {
          key: 'phone',
          label: {
            type: 'custom',
            custom: 'Phone number'
          },
          type: 'numeric'
        },
        {
          key: 'address',
          label: {
            type: 'custom',
            custom: 'Address'
          },
          type: 'text'
        },
        {
          key: 'note',
          label: {
            type: 'custom',
            custom: 'Note'
          },
          type: 'text',
          optional: true
        }
      ],
      metadata: {
        userId: reqBody.userId
      }
    })
    if (!session) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Create Checkout Session error')
    }
    const createdOrder = await orderModel.createNew({
      ...reqBody,
      status: 'Pending',
      stripeCheckoutLink: session.url,
      checkOutSessionId: session.id,
      userId: new ObjectId(reqBody.userId),
      couponId,
      couponCode,
      discountAmount,
      listProducts
    })
    for (let i = 0; i < listProducts.length; i++) {
      const product = await productModel.findOneById(listProducts[i]._id.toString())
      const newQuantity = product.quantity - listProducts[i].quantityAddtoCart
      await productModel.findAndUpdate(listProducts[i]._id.toString(), { quantity: newQuantity })
    }
    const getOrder = await orderModel.findOneById(createdOrder.insertedId)
    return responseData(getOrder)
  } catch (error) {
    for (const { productId, originalQty } of originalQuantities) {
      await productModel.findAndUpdate(productId, { quantity: originalQty })
    }
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

const getOrdersByUser = async (userId: string, page: number, pageSize: number) => {
  try {
    const allOrder = await orderModel.getOrdersByUser(userId, page, pageSize)
    return responseData(allOrder)
  } catch (error) {
    throw error
  }
}

const getOrderInfo = async (req: any) => {
  try {
    const getOrder = await orderModel.findOneById(req.params.id)
    if (!getOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    if (req.user.isAdmin !== true && req.user._id !== new ObjectId(getOrder[0].userId)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
    }
    //get detail product
    const listProducts = []
    for (let i = 0; i < getOrder[0].listProducts.length; i++) {
      const product = await productModel.findOneById(getOrder[0].listProducts[i]._id)
      listProducts.push({ ...product, quantityInOrder: getOrder[0].listProducts[i].quantity })
    }

    return responseData({ ...getOrder[0], listProductsDetail: listProducts })
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
    ////////////////////////////////////////////
    //do dac thu cua stripe nen k can thiep dc vao order da tao(ke ca thay doi total price hay thay doi list product)
    // const oldListProducts = cloneDeep(order.listProducts)
    // const concatListProduct = [...oldListProducts, ...data.listProducts]
    // //tra lai quantity product cho kho truoc
    // for (let i = 0; i < oldListProducts.length; i++) {
    //   const product = await productModel.findOneById(oldListProducts[i].id)
    //   const newQuantity = product.quantity + oldListProducts[i].quantity
    //   await productModel.findAndUpdate(oldListProducts[i].id, { quantity: newQuantity })
    // }
    // // update lai product sai khi co mang da gop tu list product moi update
    // const arrListProduct = concatListProduct.reduce((acc: any, item: any) => {
    //   if (acc.length === 0) {
    //     acc.push(item)
    //     return acc
    //   }
    //   const exitsItem = acc.find((i: any) => i.id === item.id)
    //   if (exitsItem) {
    //     exitsItem.quantity = item.quantity
    //   } else {
    //     acc.push(item)
    //   }
    //   return acc
    // }, [])
    // //bat dau cap nhat lai
    // for (let i = 0; i < arrListProduct.length; i++) {
    //   const product = await productModel.findOneById(arrListProduct[i].id)
    //   const newQuantity = product.quantity - arrListProduct[i].quantity
    //   await productModel.findAndUpdate(arrListProduct[i].id, { quantity: newQuantity })
    // }
    // // //remove list product has quantity: 0
    // const changeData = {
    //   ...data,
    //   listProducts: arrListProduct.filter((item: any) => item.quantity > 0),
    //   updatedAt: Date.now()
    // }
    /////////////////////////////////////////////////////
    const changeData = {
      ...data,
      updatedAt: Date.now()
    }
    await orderModel.findAndUpdate(id, changeData)
    //get latest data
    const orderUpdated = await orderModel.findOneById(id)
    
    if (data.status && data.status !== order[0].status) {
      const statusMessages: any = {
        'Pending': 'Your order is now pending',
        'Processing': 'Your order is being processed',
        'Shipped': 'Your order has been shipped',
        'Delivered': 'Your order has been delivered',
        'Completed': 'Your order is completed',
        'Cancelled': 'Your order has been cancelled'
      }
      
      if (orderUpdated && orderUpdated[0] && statusMessages[data.status]) {
        await notificationService.createNotification(
          orderUpdated[0].userId.toString(),
          'order',
          `Order Status: ${data.status}`,
          statusMessages[data.status],
          { orderId: id }
        )
      }
    }
    
    return responseData(orderUpdated)
  } catch (error) {
    throw error
  }
}

const updateOrderInfo = async (id: string, data: any) => {
  try {
    const getOrder = await orderModel.findOneBySessionId(id)
    if (!getOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    const changeData = {
      ...getOrder,
      status: data.status,
      address: data.address,
      phone: data.phone,
      note: data.note,
      isPaid: data.isPaid,
      totalPrice: data.totalPrice,
      stripeCheckoutLink: '',
      updatedAt: Date.now()
    }
    await orderModel.findAndUpdate(getOrder._id, changeData)
    const newOrder = await orderModel.findOneById(getOrder._id)

    if (data.status && data.status !== getOrder.status) {
      const statusMessages: any = {
        'Pending': 'Your order is now pending',
        'Processing': 'Your order is being processed',
        'Shipped': 'Your order has been shipped',
        'Delivered': 'Your order has been delivered',
        'Completed': 'Your order is completed',
        'Cancelled': 'Your order has been cancelled'
      }
      
      if (newOrder && newOrder[0] && statusMessages[data.status]) {
        await notificationService.createNotification(
          newOrder[0].userId.toString(),
          'order',
          `Order Status: ${data.status}`,
          statusMessages[data.status],
          { orderId: getOrder._id.toString() }
        )
      }
    }

    return responseData(newOrder)
  } catch (error) {
    throw error
  }
}

const deleteOrderById = async (id: string) => {
  try {
    const order = await orderModel.findOneById(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    await orderModel.findAndRemove(id)
  } catch (error) {
    throw error
  }
}

const checkSessionExpire = async (id: string) => {
  try {
    const order = await orderModel.findOneBySessionId(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Session order not found')
    }
    // await orderModel.findAndRemove(id)
    const session = await stripe.checkout.sessions.retrieve(order.checkOutSessionId)
    //check time
    const timeExpire = moment(session.expires_at * 1000).format('YYYY-MM-DD HH:mm:ss')
    const timeNow = moment().format('YYYY-MM-DD HH:mm:ss')
    if (timeExpire < timeNow) {
      //update status
      await orderModel.findAndUpdate(order._id, {
        status: 'Expired'
      })
    }
    return responseData({
      timeExpire: new Date(session.expires_at * 1000)
    })
  } catch (error) {
    throw error
  }
}

export const orderServices = {
  createNew,
  getOrders,
  getOrderInfo,
  editOrderInfo,
  deleteOrderById,
  updateOrderInfo,
  getOrdersByUser,
  createNewByAdmin,
  checkSessionExpire
}
