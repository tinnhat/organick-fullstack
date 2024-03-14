import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { userModel } from '~/models/userModel'

export const Auth = (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.slice(7, authorization.length) // Bearer xxxxx
    try {
      jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
        if (err) {
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Failed to authenticate token' })
        }
        //Update req.user
        const user = await userModel.findOneById((decoded as JwtPayload)._id)
        if (user) {
          req.user = user
          next()
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong authentication token' })
        }
      })
    } catch (error) {
      next(error)
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication token missing' })
  }
}
