import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authRoute } from './authRoute'
import { categoryRoute } from './categoryRoute'
import { orderRoute } from './orderRoute'
import { productRoute } from './productRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

Router.use('/users', userRoute)

Router.use('/categories', categoryRoute)

Router.use('/products', productRoute)

Router.use('/orders', orderRoute)

Router.use('/auth', authRoute)

export const APIs_V1 = Router
