class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    //quang loi stack trace (de debug)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
