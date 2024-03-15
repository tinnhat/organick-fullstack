import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const AdminAuth = async (req: any, res: Response, next: NextFunction) => {
  if (!req.user.isAdmin) return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Access denied' })
  next()
}
