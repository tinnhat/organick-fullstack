import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { categoryModel } from '~/models/categoryModel'
import { productModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { responseData, slugify, uploadImage } from '~/utils/algorithms'
/* eslint-disable no-useless-catch */

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
    const product = await productModel.findOneById(id)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    const changeData = {
      ...data,
      updatedAt: Date.now(),
      image: reqFile ? await uploadImage(reqFile, 'organick/products') : product.image,
      slug: slugify(data.name)
    }
    await productModel.findAndUpdate(id, changeData)
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
