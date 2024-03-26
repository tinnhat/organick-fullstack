import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

const useFetch = () => {
  const { data: session, status, update } = useSession()
  let accessToken = session?.user.access_token

  let baseURL = 'http://localhost:8017/v1'

  let originalRequest = async (url: string, config: any = {}) => {
    let response = await fetch(`${baseURL}${url}`, config)
    let data = await response.json()
    return { response, data }
  }

  let refreshToken = async (accessToken: any) => {
    const refreshToken = session?.user.refreshToken
    //check refresh token con han hay khong
    //neu con han thi kep vao header api get refresh token len server de cap nhat lai token moi
    //neu het han thi redirect nguoi dung ve login -> goi ham logout
    const userRefresh = jwtDecode(refreshToken)
    const isExpired = dayjs.unix(userRefresh.exp!).diff(dayjs()) < 1
    if (isExpired) {
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
      return
    }
    try {
      let response = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          refreshToken: refreshToken,
        }
      })
      let result = await response.json()
      //update lai session cua nextAuth
      await update({
        ...session,
        user: {
          ...session!.user,
          access_token: result.data.accessToken,
          refreshToken: result.data.user.refreshToken,
        },
      })
      return result
    } catch (error) {
      console.log(error)
      //signout
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
    }
  }

  let callFetch = async (url: string, config: any) => {
    const user = jwtDecode(accessToken)
    const isExpired = dayjs.unix(user.exp!).diff(dayjs()) < 1
    if (isExpired) {
      const newAccessToken = await refreshToken(accessToken)
      accessToken = newAccessToken.data.accessToken
    }

    config['headers'] = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    }

    let { response, data } = await originalRequest(url, config)
    return { response, data }
  }

  return callFetch
}

export default useFetch
