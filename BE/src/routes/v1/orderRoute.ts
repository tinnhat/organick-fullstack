import express from 'express'
import { orderController } from '~/controllers/orderController'
import { productController } from '~/controllers/productController'
import { AdminAuth } from '~/middlewares/adminMiddleware'
import { Auth } from '~/middlewares/authMiddleware'
import { orderValidation } from '~/validations/orderValidation'
import { productValidation } from '~/validations/productValidation'

const Router = express.Router()

Router.get('/', Auth, AdminAuth, orderController.getOrders)

Router.post('/', Auth, AdminAuth, orderValidation.createNew, orderController.createNew)

Router.get('/:id', Auth, AdminAuth, orderValidation.getOrderInParams, orderController.getOrderInfo)

Router.put('/:id', Auth, AdminAuth, orderValidation.editOrderInfo, orderController.editOrderInfo)

Router.delete('/:id', Auth, AdminAuth, orderValidation.getOrderInParams, orderController.deleteOrderById)

export const orderRoute = Router
