import express, { Request, Response } from 'express'
import { env } from './config/environment'
import { corsOptions } from './config/cors'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { closeDB, connectToDatabase } from './config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import multer from 'multer'

const startServer = () => {
  const upload = multer()
  const app = express()
  const port = Number(env.APP_PORT!) || 4000
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(upload.single('file'))
  app.use('/v1', APIs_V1)
  //middleware xu ly loi
  app.use(errorHandlingMiddleware)

  app.listen(port, env.APP_HOST!, () => {
    // eslint-disable-next-line no-console
    console.log(`Running at http://${env.APP_HOST}:${port}`)
  })

  //đóng các tác vụ trước khi close app
  exitHook(() => {
    closeDB()
  })
}
// su dung IIFE
;(async () => {
  try {
    await connectToDatabase()
    console.log('Connected to DB')
    startServer()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()