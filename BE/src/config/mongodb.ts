import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

// khoi tao mot doi tuong trelloDB ban dau la null
let trelloDatabaseInstance: any = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI!, {
  // co the dung chi dinh server api version hoac khong van ket noi dc
  // serverApi: ServerApiVersion.v1
  // https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

//connect to DB
export const connectToDatabase = async () => {
  // Connect the client to the server
  await mongoClientInstance.connect()
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
  return trelloDatabaseInstance
}

// chi goi duoc ham getDB khi da ket noi thanh cong instance toi mongoDB
export const getDB = () => {
  if (!mongoClientInstance) throw new Error('DB is not connected')
  return trelloDatabaseInstance
}

export const closeDB = async () => {
  await mongoClientInstance.close()
}
