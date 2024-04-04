
import ApiError from '../utils/ApiError'
import { WHITE_LIST } from '../utils/constants'
import { env } from './environment'
import { StatusCodes } from 'http-status-codes'

export const corsOptions: any = {
  origin: function (origin: any, callback: any) {
    console.log('origin', origin);
    
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    if (!origin && env.BUILD_MODE === 'dev') {
      console.log('Origin not provided, allowing in development mode.');
      return callback(null, true)
    }

    // Kiểm tra dem origin có phải là domain được chấp nhận hay không
    if (WHITE_LIST.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    console.log('Origin not allowed:', origin);
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request,
  credentials: true
}
