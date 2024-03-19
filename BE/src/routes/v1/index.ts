import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { categoryRoute } from './categoryRoute'
import { productRoute } from './productRoute'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

Router.use('/users', userRoute)

Router.use('/categories', categoryRoute)

Router.use('/products', productRoute)

export const APIs_V1 = Router
