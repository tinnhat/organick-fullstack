jest.mock('../../config/mongodb', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      insertOne: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(() => ({
        skip: jest.fn(() => ({
          limit: jest.fn(() => ({
            toArray: jest.fn()
          }))
        })),
        toArray: jest.fn()
      })),
      updateOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      countDocuments: jest.fn()
    }))
  }))
}))

jest.mock('../../utils/algorithms', () => ({
  validateBeforeCreate: jest.fn((data) => Promise.resolve(data)),
  responseData: jest.fn((data) => ({ data }))
}))