import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userService'

const Router = express.Router()

//validate refresh co hay khong
Router.post('/refresh', async (req: Request, res: Response) => {
  const refreshtoken: any = req.headers.refreshtoken
  // check trong db xem cos refresh token nay khong
  //neu co thi gui lai access token moi va cap nhat refresh token moi cho user
  // neu khong co thi tra ve 401
  const checkRefreshToken = await userServices.checkRefreshToken(refreshtoken)
  res.status(StatusCodes.OK).json(checkRefreshToken)
})

export const authRoute = Router
