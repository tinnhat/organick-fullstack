import express from 'express'
import { couponController } from '../../controllers/couponController'
import { couponValidation } from '../../validations/couponValidation'
import { Auth } from '../../middlewares/authMiddleware'
import { AdminAuth } from '../../middlewares/adminMiddleware'

const Router = express.Router()

Router.post('/', Auth, AdminAuth, couponValidation.createNew, couponController.createCoupon)

Router.get('/', Auth, AdminAuth, couponController.getCoupons)

Router.get('/:id', Auth, AdminAuth, couponValidation.getCouponInParams, couponController.getCouponById)

Router.put('/:id', Auth, AdminAuth, couponValidation.updateCoupon, couponController.updateCoupon)

Router.delete('/:id', Auth, AdminAuth, couponValidation.getCouponInParams, couponController.deleteCoupon)

Router.post('/apply', Auth, couponValidation.applyCoupon, couponController.applyCoupon)

Router.post('/validate', Auth, couponValidation.applyCoupon, couponController.validateCoupon)

export const couponRoute = Router
