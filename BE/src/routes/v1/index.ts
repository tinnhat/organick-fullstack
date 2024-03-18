import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { categoryRoute } from './categoryRoute'

const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

Router.use('/users', userRoute)

Router.use('/categories', categoryRoute)


export const APIs_V1 = Router
