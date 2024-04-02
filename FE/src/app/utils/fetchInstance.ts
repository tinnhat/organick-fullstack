import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'

const originalRequest = async (url: string, config: any) => {
  let res = await fetch(url, config)
  let data = await res.json()
  return { response: res, data }
}
const refreshToken = async (oldToken: string) => {
  const res = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldToken }),
  })
  const data = await res.json()
  return data
}
const customFetcher = async (accessToken: string, url: string, config: any = {}) => {
  //get access token
  let token = accessToken
  const user = jwtDecode(token!) // decode
  const isExpried = dayjs.unix(user.exp!).diff(dayjs()) < 1
  if (isExpried) {
    //get new access token
    //truyen refresh token vao de lay access token
    //neu refresh token het han thi cho nguoi dung dang nhap lai luon
    token = await refreshToken(accessToken)
  }
  // proceed with request
  config['headers'] = {
    ...config['headers'],
    Authorization: `Bearer ${token}`,
  }
  const { response, data } = await originalRequest(url, config)
  return { response, data }
}

export default customFetcher
