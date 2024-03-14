import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello World'
  })
})

export const APIs_V1 = Router
