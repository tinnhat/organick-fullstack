import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { userModel } from '../models/userModel'
import { productModel } from '../models/productModel'
import { responseData } from '../utils/algorithms'
import ApiError from '../utils/ApiError'

const getWishlist = async (userId: string) => {
  try {
    const wishlistProductIds = await userModel.getWishlist(userId)
    if (!wishlistProductIds || wishlistProductIds.length === 0) {
      return responseData([])
    }
    const products = await Promise.all(
      wishlistProductIds.map(async (productId: string) => {
        const product = await productModel.findOneById(productId)
        return product
      })
    )
    const validProducts = products.filter((product: any) => product !== null && product._destroy !== true)
    return responseData(validProducts)
  } catch (error) {
    throw error
  }
}

const addToWishlist = async (userId: string, productId: string) => {
  try {
    const product = await productModel.findOneById(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    const wishlist = await userModel.addToWishlist(userId, productId)
    return responseData({ wishlist, message: 'Product added to wishlist' })
  } catch (error) {
    throw error
  }
}

const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    const wishlist = await userModel.removeFromWishlist(userId, productId)
    return responseData({ wishlist, message: 'Product removed from wishlist' })
  } catch (error) {
    throw error
  }
}

const toggleWishlist = async (userId: string, productId: string) => {
  try {
    const product = await productModel.findOneById(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    const isNowInWishlist = await userModel.toggleWishlist(userId, productId)
    return responseData({
      isInWishlist: isNowInWishlist,
      message: isNowInWishlist ? 'Product added to wishlist' : 'Product removed from wishlist'
    })
  } catch (error) {
    throw error
  }
}

const isInWishlist = async (userId: string, productId: string) => {
  try {
    const wishlist = await userModel.getWishlist(userId)
    const isInWishlist = wishlist.includes(productId)
    return responseData({ isInWishlist })
  } catch (error) {
    throw error
  }
}

export const wishlistServices = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist
}