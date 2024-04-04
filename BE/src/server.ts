import express, { Request, Response } from 'express'
import { env } from './config/environment'

import cors from 'cors'
import exitHook from 'async-exit-hook'
import { closeDB, connectToDatabase } from './config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import multer from 'multer'
import { corsOptions } from './config/cors'

const startServer = () => {
  const upload = multer()
  const app = express()
  const port = env.APP_PORT! || 4000
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(upload.single('file'))
  app.use('/v1', APIs_V1)
  //middleware xu ly loi
  app.use(errorHandlingMiddleware)

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Running at port ${port}`)
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
