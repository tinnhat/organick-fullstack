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
    env.JWT_SECRET!,
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
    },
    env.JWT_SECRET_REFRESH!,
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
async function handleUpload(file: any, folder: string) {
  const res = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'auto',
    folder
  })
  return res
}

export const uploadImage = async (file: any, folder: string) => {
  if (file) {
    //check file type and file size
    if (file.size > FILE_SIZE) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File size exceeds the limit')
    } else if (FILE_ALLOW.includes(file.mimetype)) {
      console.log(file)
      const b64 = Buffer.from(file.buffer).toString('base64')
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64
      const cldRes = await handleUpload(dataURI, folder)
      return cldRes.secure_url
    } else {
      throw new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'Unsupported file type')
    }
  } else {
    return null
  }
}

export const checkPermission = (user: any, userId: string) => {
  if (user.isAdmin === false) {
    if (user._id.toString() !== userId) {
      return false
    }
  }
  return true
}

export const validateBeforeCreate = async (data: any, schema: any) => {
  return await schema.validateAsync(data, { abortEarly: false })
}

export const slugify = (val: string) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}
