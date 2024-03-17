import jwt from 'jsonwebtoken'
import { DEFAULT_AVATAR, FILE_ALLOW, FILE_SIZE, JWT } from './constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'
import cloudinary from 'cloudinary'
import Multer from 'multer'
import { env } from '~/config/environment'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed
    },
    env.JWT_SECRET || 'somethingsecret',
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
    env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: JWT.expiresInRefresh
    }
  )
}

export const responseData = (data: any) => ({ success: true, data })

//upload image
cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

const storage = Multer.memoryStorage()
const upload = Multer({
  storage
})
async function handleUpload(file: any) {
  const res = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'auto',
    folder: 'organick/users'
  })
  return res
}

export const uploadImage = async (file: any) => {
  if (file) {
    //check file type and file size
    if (file.size > FILE_SIZE) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File size exceeds the limit')
    } else if (FILE_ALLOW.includes(file.mimetype)) {
      const b64 = Buffer.from(file.buffer).toString('base64')
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64
      const cldRes = await handleUpload(dataURI)
      return cldRes.secure_url
    } else {
      throw new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'Unsupported file type')
    }
  } else {
    return null
  }
}

export const checkPermission = (user: any, userId: string) => {
  console.log(user._id, userId)
  if (user.isAdmin === false) {
    if (user._id.toString() !== userId) {
      return false
    }
  }
  return true
}
