import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { categoryModel } from '~/models/categoryModel'
import { productModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { responseData, slugify, uploadImage } from '~/utils/algorithms'
/* eslint-disable no-useless-catch */
import stripePackage from 'stripe'
const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!)

const getActiveProducts = async () => {
  const products = await stripe.products.list()
  const availableProducts = products.data.filter((product: any) => product.active)
  return availableProducts
}

const createNew = async (reqBody: any, reqFile: any) => {
  try {
    const checkProduct = await productModel.findOneByName(reqBody.name)
    if (checkProduct) {
      throw new Error('Product already exists')
    }
    const newProduct = {
      star: 0,
      priceSale: 0,
      ...reqBody,
      image: reqFile ? await uploadImage(reqFile, 'organick/products') : null,
      slug: slugify(reqBody.name),
      categoryId: new ObjectId(reqBody.categoryId)
    }
    const createdProduct = await productModel.createNew(newProduct)
    const getProduct = await productModel.findOneById(createdProduct.insertedId)
    return responseData(getProduct)
  } catch (error) {
    throw error
  }
}

const getProducts = async (page: number, pageSize: number) => {
  try {
    const allProducts = await productModel.getProducts(page, pageSize)
    return responseData(allProducts)
  } catch (error) {
    throw error
  }
}

const getProductInfo = async (productId: string) => {
  try {
    console.log(productId)
    const getProduct = await productModel.findOneById(productId)
    if (!getProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    return responseData(getProduct)
  } catch (error) {
    throw error
  }
}

const editProductInfo = async (id: string, data: any, reqFile: any) => {
  try {
    //get list product active tren stripe xong cap nhat lai tren do
    const product = await productModel.findOneById(id)
    const listProductActiveInStripe = await getActiveProducts()
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    const changeData = {
      name: data.name,
      priceSale: +data.priceSale || 0,
      price: +data.price,
      quantity: +data.quantity,
      star: +data.star,
      categoryId: new ObjectId(data.categoryId),
      updatedAt: Date.now(),
      image: reqFile ? await uploadImage(reqFile, 'organick/products') : product.image,
      slug: slugify(data.name),
      _destroy: data._destroy === 'true' ? true : false
    }
    //update vao DB
    await productModel.findAndUpdate(id, changeData)
    //update vao stripe
    const productUpdateInStripe: any = listProductActiveInStripe.find((item: any) => item.id === id)
    //get price
    const currentPrice = await await stripe.prices.retrieve(productUpdateInStripe.default_price)
    if (currentPrice.unit_amount! / 100 !== data.price) {
      //tao moi va cap nhat
      const newPrice = await await stripe.prices.create({
        currency: 'usd',
        unit_amount: +data.price * 100,
        product: productUpdateInStripe.id
      })
      //add new price for product
      await stripe.products.update(productUpdateInStripe.id, {
        name: data.name,
        description: data.description,
        images: [reqFile ? await uploadImage(reqFile, 'organick/products') : product.image],
        default_price: newPrice.id, //update lai gia moi
        url: slugify(data.name)
      })
    } else {
      //update
      await stripe.products.update(productUpdateInStripe.id, {
        name: data.name,
        description: data.description,
        images: [reqFile ? await uploadImage(reqFile, 'organick/products') : product.image],
        url: slugify(data.name)
      })
    }
    //get latest data
    const productUpdated = await productModel.findOneById(id)
    return responseData(productUpdated)
  } catch (error) {
    throw error
  }
}

const deleteProductById = async (id: string) => {
  try {
    const product = await productModel.findOneById(id)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    const result = await productModel.findAndRemove(id)
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const checkList = async (data: any) => {
  try {
    const allProducts = await productModel.getProducts(1, 1000)
    //check quantity of product
    for (let i = 0; i < data.products.length; i++) {
      const product = allProducts.find((item: any) => item._id.toString() === data.products[i]._id.toString())
      if (data.products[i].quantityAddCart > product.quantity) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Quantity of product ${product.name} in stock is not enough`)
      }
    }
    return data.products
  } catch (error) {
    throw error
  }
}

export const productServices = {
  createNew,
  getProducts,
  getProductInfo,
  editProductInfo,
  deleteProductById,
  checkList
}
