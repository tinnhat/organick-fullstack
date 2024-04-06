import express from 'express'
import { Auth } from '../../middlewares/authMiddleware'
import { AdminAuth } from '../../middlewares/adminMiddleware'
import { orderValidation } from '../../validations/orderValidation'
import { orderController } from '../../controllers/orderController'

const Router = express.Router()

Router.get('/', Auth, AdminAuth, orderController.getOrders)

Router.post('/', Auth, orderValidation.createNew, orderController.createNew)

Router.get('/checkout/:sessionId', orderController.checkSessionExpire)

Router.post('/admin', Auth, AdminAuth, orderValidation.createNew, orderController.createNewByAdmin)

Router.get('/user/:id', Auth, orderValidation.getOrdersByUser, orderController.getOrdersByUser)

Router.get('/:id', Auth, orderValidation.getOrderInParams, orderController.getOrderInfo)

Router.put('/:id', Auth, AdminAuth, orderValidation.editOrderInfo, orderController.editOrderInfo)

Router.put('/checkout/:id', orderValidation.updateOrderInfo, orderController.updateOrderInfo)

Router.delete('/:id', Auth, AdminAuth, orderValidation.getOrderInParams, orderController.deleteOrderById)

export const orderRoute = Router
