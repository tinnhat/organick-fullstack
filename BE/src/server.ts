import express, { Request, Response } from 'express'
import { env } from './config/environment'
import { createServer } from 'http'

import cors from 'cors'
import exitHook from 'async-exit-hook'
import { closeDB, connectToDatabase } from './config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import multer from 'multer'
import { corsOptions } from './config/cors'
import { initializeSocket } from './config/socket'

const startServer = () => {
  const upload = multer()
  const app = express()
  const port = env.APP_PORT! || 4000
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(upload.single('file'))
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  const httpServer = createServer(app)

  initializeSocket(httpServer)

  const server = httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Running at port ${port}`)
  })

  exitHook(() => {
    closeDB()
  })
}

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
