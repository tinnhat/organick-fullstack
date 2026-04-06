import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { couponServices } from '../services/couponService'

const createCoupon = async (req: Request, res: Response, next: any) => {
  try {
    const coupon = await couponServices.createCoupon(req.body)
    res.status(StatusCodes.CREATED).json(coupon)
  } catch (error) {
    next(error)
  }
}

const getCoupons = async (req: Request, res: Response, next: any) => {
  try {
    const { page = 1, pageSize = 10, isActive, type } = req.query
    const filters: any = {}
    if (isActive !== undefined) filters.isActive = isActive === 'true'
    if (type) filters.type = type as string
    const coupons = await couponServices.getCoupons(filters, Number(page), Number(pageSize))
    res.status(StatusCodes.OK).json(coupons)
  } catch (error) {
    next(error)
  }
}

const getCouponById = async (req: Request, res: Response, next: any) => {
  try {
    const coupon = await couponServices.getCouponById(req.params.id)
    res.status(StatusCodes.OK).json(coupon)
  } catch (error) {
    next(error)
  }
}

const updateCoupon = async (req: Request, res: Response, next: any) => {
  try {
    const coupon = await couponServices.updateCoupon(req.params.id, req.body)
    res.status(StatusCodes.OK).json(coupon)
  } catch (error) {
    next(error)
  }
}

const deleteCoupon = async (req: Request, res: Response, next: any) => {
  try {
    const result = await couponServices.deleteCoupon(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const applyCoupon = async (req: any, res: Response, next: any) => {
  try {
    const { code, orderAmount } = req.body
    const userId = req.user._id.toString()
    const result = await couponServices.applyCoupon(code, userId, orderAmount)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const validateCoupon = async (req: any, res: Response, next: any) => {
  try {
    const { code, orderAmount } = req.body
    const userId = req.user._id.toString()
    const result = await couponServices.validateCoupon(code, userId, orderAmount)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const couponController = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  validateCoupon
}
