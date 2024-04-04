import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { categoryRoute } from './categoryRoute'
import { productRoute } from './productRoute'
import { orderRoute } from './orderRoute'
import { authRoute } from './authRoute'
import { webHooksRoute } from './webhookRoute'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

Router.use('/users', userRoute)

Router.use('/webhook_endpoints', webHooksRoute)

Router.use('/categories', categoryRoute)

Router.use('/products', productRoute)

Router.use('/orders', orderRoute)

Router.use('/auth', authRoute)

export const APIs_V1 = Router
