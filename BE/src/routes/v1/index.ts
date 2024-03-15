import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

Router.use('/users', userRoute)

export const APIs_V1 = Router
