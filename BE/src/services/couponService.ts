import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { isAfter } from 'date-fns'
import { couponModel } from '../models/couponModel'
import { responseData } from '../utils/algorithms'
import ApiError from '../utils/ApiError'
/* eslint-disable no-useless-catch */

const createCoupon = async (data: any) => {
  try {
    const existingCoupon = await couponModel.findOneByCode(data.code)
    if (existingCoupon) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon code already exists')
    }
    const newCoupon = {
      ...data,
      code: data.code.toUpperCase()
    }
    const createdCoupon = await couponModel.createNew(newCoupon)
    const getCoupon = await couponModel.findOneById(createdCoupon.insertedId)
    return responseData(getCoupon)
  } catch (error) {
    throw error
  }
}

const getCoupons = async (filters: any = {}, page: number = 1, pageSize: number = 10) => {
  try {
    const result = await couponModel.getCoupons(filters, page, pageSize)
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const getCouponById = async (id: string) => {
  try {
    const coupon = await couponModel.findOneById(id)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    return responseData(coupon)
  } catch (error) {
    throw error
  }
}

const updateCoupon = async (id: string, data: any) => {
  try {
    const coupon = await couponModel.findOneById(id)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await couponModel.findOneByCode(data.code)
      if (existingCoupon) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon code already exists')
      }
      data.code = data.code.toUpperCase()
    }
    await couponModel.findAndUpdate(id, data)
    const updatedCoupon = await couponModel.findOneById(id)
    return responseData(updatedCoupon)
  } catch (error) {
    throw error
  }
}

const deleteCoupon = async (id: string) => {
  try {
    const coupon = await couponModel.findOneById(id)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    await couponModel.findAndRemove(id)
    return responseData({ message: 'Coupon deleted successfully' })
  } catch (error) {
    throw error
  }
}

const validateCoupon = async (code: string, userId: string, orderAmount: number) => {
  try {
    const coupon = await couponModel.findOneByCode(code)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    if (!coupon.isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon is not active')
    }
    if (coupon._destroy) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon has been deleted')
    }
    if (isAfter(new Date(), new Date(coupon.expiresAt))) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon has expired')
    }
    if (orderAmount < coupon.minOrderAmount) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Minimum order amount is ${coupon.minOrderAmount}`)
    }
    if (coupon.maxUses !== null && coupon.usedBy.length >= coupon.maxUses) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon usage limit has been reached')
    }
    const alreadyUsed = coupon.usedBy.some((use: any) => use.userId.toString() === userId.toString())
    if (alreadyUsed) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already used this coupon')
    }
    return responseData({
      valid: true,
      type: coupon.type,
      value: coupon.value,
      code: coupon.code
    })
  } catch (error) {
    throw error
  }
}

const applyCoupon = async (code: string, userId: string, orderAmount: number) => {
  try {
    const coupon = await couponModel.findOneByCode(code)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }

    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = (orderAmount * coupon.value) / 100
    } else {
      discountAmount = coupon.value
    }
    discountAmount = Math.min(discountAmount, orderAmount)

    const userObjectId = new ObjectId(userId)
    const result = await couponModel.atomicApplyCoupon(
      code.toUpperCase(),
      userObjectId,
      orderAmount,
      coupon.minOrderAmount,
      coupon.maxUses,
      coupon.expiresAt,
      userId
    )

    if (!result) {
      const couponAgain = await couponModel.findOneByCode(code)
      if (!couponAgain) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
      }
      if (couponAgain.usedBy.some((use: any) => use.userId.toString() === userId.toString())) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already used this coupon')
      }
      if (couponAgain.maxUses !== null && couponAgain.usedBy.length >= couponAgain.maxUses) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon usage limit has been reached')
      }
      if (isAfter(new Date(), new Date(couponAgain.expiresAt))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon has expired')
      }
      if (orderAmount < couponAgain.minOrderAmount) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Minimum order amount is ${couponAgain.minOrderAmount}`)
      }
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to apply coupon')
    }

    return responseData({
      couponId: result._id,
      couponCode: result.code,
      discountAmount,
      originalAmount: orderAmount,
      finalAmount: orderAmount - discountAmount
    })
  } catch (error) {
    throw error
  }
}
    discountAmount = Math.min(discountAmount, orderAmount)
    finalAmount = orderAmount - discountAmount

    const userObjectId = new ObjectId(userId)
    const now = new Date()

    const result = await couponModel.atomicApplyCoupon(
      code.toUpperCase(),
      userObjectId,
      orderAmount,
      coupon.minOrderAmount,
      coupon.maxUses,
      coupon.expiresAt,
      userId
    )

    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to apply coupon - may be invalid, expired, or usage limit reached')
    }

    return responseData({
      couponId: result.couponId,
      couponCode: result.couponCode,
      discountAmount,
      originalAmount: orderAmount,
      finalAmount
    })
  } catch (error) {
    throw error
  }
}

export const couponServices = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon
}
