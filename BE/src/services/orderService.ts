import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import { orderModel } from '~/models/orderModel'
import { productModel } from '~/models/productModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { responseData } from '~/utils/algorithms'
/* eslint-disable no-useless-catch */
import stripePackage from 'stripe'
const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!)

const getActiveProducts = async () => {
  const products = await stripe.products.list()
  const availableProducts = products.data.filter((product: any) => product.active)
  return availableProducts
}

const createNew = async (reqBody: any) => {
  try {
    //check xem co user hay khong
    const userExist = await userModel.findOneById(reqBody.userId)
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    //check xem product co ton tai hay khong

    for (let i = 0; i < reqBody.listProducts.length; i++) {
      const product = await productModel.findOneById(reqBody.listProducts[i]._id)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      } else {
        //co product -> check so luong
        if (product.quantity < reqBody.listProducts[i].quantityAddtoCart) {
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
      const product = await productModel.findOneById(reqBody.listProducts[i]._id)
      const newQuantity = product.quantity - reqBody.listProducts[i].quantityAddtoCart
      await productModel.findAndUpdate(reqBody.listProducts[i]._id, { quantity: newQuantity })
    }
    const getOrder = await orderModel.findOneById(createdOrder.insertedId)
    return responseData(getOrder)
  } catch (error) {
    throw error
  }
}

const createNewByAdmin = async (reqBody: any) => {
  try {
    //check xem co user hay khong
    const userExist = await userModel.findOneById(reqBody.userId)
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    //check xem product co ton tai hay khong

    for (let i = 0; i < reqBody.listProducts.length; i++) {
      const product = await productModel.findOneById(reqBody.listProducts[i]._id)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      } else {
        //co product -> check so luong
        if (product.quantity < reqBody.listProducts[i].quantityAddtoCart) {
          throw new ApiError(StatusCodes.NOT_FOUND, `Quantity of product: "${product.name}" in stock is not enough`)
        }
      }
    }
    //tao checkout tren stripe -> luu lai link + checkout session
    //get list product active in stripe
    let activeProducts = await getActiveProducts()
    try {
      for (const product of reqBody.listProducts) {
        const stripeProduct = activeProducts.find((activeProduct: any) => activeProduct.id === product._id)
        //chua co product
        if (stripeProduct === undefined) {
          await stripe.products.create({
            id: product._id,
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
    for (const product of reqBody.listProducts) {
      const stripeProduct = activeProducts.find((activeProduct: any) => activeProduct.id === product._id)

      if (stripeProduct) {
        //push product thanh toan len stripe de show UI checkout
        await stripeItems.push({
          price: stripeProduct.default_price,
          quantity: product.quantityAddtoCart
        })
      }
    }
    const session = await stripe.checkout.sessions.create({
      line_items: stripeItems,
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/pending?session_id={CHECKOUT_SESSION_ID}`,
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
    //luu vao BE
    const createdOrder = await orderModel.createNew({
      ...reqBody,
      status: 'Pending',
      stripeCheckoutLink: session.url,
      checkOutSessionId: session.id,
      userId: new ObjectId(reqBody.userId)
    })
    //update product quantity in stock
    for (let i = 0; i < reqBody.listProducts.length; i++) {
      const product = await productModel.findOneById(reqBody.listProducts[i]._id)
      const newQuantity = product.quantity - reqBody.listProducts[i].quantityAddtoCart
      await productModel.findAndUpdate(reqBody.listProducts[i]._id, { quantity: newQuantity })
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

    return responseData(newOrder)
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
  deleteOrderById,
  updateOrderInfo,
  getOrdersByUser,
  createNewByAdmin
}
