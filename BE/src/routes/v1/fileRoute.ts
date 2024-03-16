import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'
import Multer from 'multer'
import { FILE_ALLOW, FILE_SIZE } from '~/utils/constants'
import { Auth } from '~/middlewares/authMiddleware'
const Router = express.Router()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = Multer.memoryStorage()
const upload = Multer({
  storage
})
async function handleUpload(file: any) {
  const res = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'auto',
    folder: 'organick'
  })
  return res
}

Router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    if (req.file) {
      if (req.file.size > FILE_SIZE) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'File size exceeds the limit' })
      } else if (FILE_ALLOW.includes(req.file.mimetype)) {
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64
        const cldRes = await handleUpload(dataURI)
        res.json(cldRes)
      } else {
        res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({ error: 'Unsupported file type' })
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file uploaded' })
    }
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error as string
    })
  }
})

export const fileRoute = Router
