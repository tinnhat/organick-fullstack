import express from 'express'
import { productController } from '../../controllers/productController'
import { productValidation } from '../../validations/productValidation'
import { Auth } from '../../middlewares/authMiddleware'
import { AdminAuth } from '../../middlewares/adminMiddleware'
const Router = express.Router()

Router.get('/', productController.getProducts)

Router.get('/search', productController.getProductsByName)


Router.post('/checkList', productValidation.checkList, productController.checkList)

Router.post('/', Auth, AdminAuth, productValidation.createNew, productController.createNew)

Router.get('/:id', productValidation.getProductInParams, productController.getProductInfo)

Router.put('/:id', Auth, AdminAuth, productValidation.editProductInfo, productController.editProductInfo)

Router.delete('/:id', Auth, AdminAuth, productValidation.getProductInParams, productController.deleteProductById)

export const productRoute = Router
