
import { WHITE_LIST } from '../utils/constants'

export const corsOptions: any = function (req, callback) {
  let corsOptions
  if (WHITE_LIST.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
