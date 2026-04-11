import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { wishlistServices } from '../services/wishlistService'

const getWishlist = async (req: any, res: Response, next: any) => {
  try {
    const wishlist = await wishlistServices.getWishlist(req.user._id.toString())
    res.status(StatusCodes.OK).json(wishlist)
  } catch (error) {
    next(error)
  }
}

const addToWishlist = async (req: any, res: Response, next: any) => {
  try {
    const { productId } = req.body
    const result = await wishlistServices.addToWishlist(req.user._id.toString(), productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const removeFromWishlist = async (req: any, res: Response, next: any) => {
  try {
    const { productId } = req.params
    const result = await wishlistServices.removeFromWishlist(req.user._id.toString(), productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const toggleWishlist = async (req: any, res: Response, next: any) => {
  try {
    const { productId } = req.body
    const result = await wishlistServices.toggleWishlist(req.user._id.toString(), productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const wishlistController = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
}