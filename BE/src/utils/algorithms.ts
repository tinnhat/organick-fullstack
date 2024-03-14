import jwt from 'jsonwebtoken'
import { JWT } from './constants'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: JWT.expiresIn
    }
  )
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: JWT.expiresInRefresh
    }
  )
}
