import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { categoryController } from '../../controllers/categoryController'
import { AdminAuth } from '../../middlewares/adminMiddleware'
import { Auth } from '../../middlewares/authMiddleware'
import { categoryValidation } from '../../validations/categoryValidation'
const Router = express.Router()

Router.get('/', categoryController.getCategories)

Router.post('/', Auth, AdminAuth, categoryValidation.createNew, categoryController.createNew)

Router.get('/:id', Auth, AdminAuth, categoryValidation.getCategoryInParams, categoryController.getCategoryInfo)

Router.put('/:id', Auth, AdminAuth, categoryValidation.editCategoryInfo, categoryController.editCategoryInfo)

Router.delete('/:id', Auth, AdminAuth, categoryValidation.getCategoryInParams, categoryController.deleteCategoryById)

export const categoryRoute = Router
