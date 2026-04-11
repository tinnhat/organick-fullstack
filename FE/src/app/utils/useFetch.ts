import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

const useFetch = () => {
  const { data: session, status, update } = useSession()
  // Use a ref to always get the latest accessToken from session
  // This avoids stale closures where accessToken is captured once at mount

  let baseURL = process.env.HOST_BE

  let originalRequest = async (url: string, config: any = {}) => {
    try {
      let response = await fetch(`${baseURL}${url}`, config)
      let data = await response.json()
      return { response, data }
    } catch (error) {
      console.error('Request failed:', error)
      return { response: null, data: null }
    }
  }

  let refreshToken = async (accessToken: any) => {
    // Always get fresh refreshToken from session to avoid stale closures
    const refreshTokenValue = session?.user?.refreshToken
    //check refresh token con han hay khong
    //neu con han thi kep vao header api get refresh token len server de cap nhat lai token moi
    //neu het han thi redirect nguoi dung ve login -> goi ham logout
    if (!refreshTokenValue) {
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
      return null
    }
    let userRefresh: any
    try {
      userRefresh = jwtDecode(refreshTokenValue)
    } catch (error) {
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
      return null
    }
    const isExpired = dayjs.unix(userRefresh.exp!).diff(dayjs()) < 1
    if (isExpired) {
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
      return null
    }
    try {
      let response = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          refreshToken: refreshTokenValue,
        },
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
      //signout
      signOut()
      toast.error('Please login again', { position: 'bottom-right' })
      return null
    }
  }

  let callFetch = async (url: string, config: any) => {
    // Always get fresh accessToken from session
    let accessToken = session?.user?.access_token
    
    if (!accessToken) {
      return null
    }
    let user: any
    try {
      user = jwtDecode(accessToken)
    } catch (error) {
      // Invalid token, try to refresh
      const newAccessToken = await refreshToken(accessToken)
      if (!newAccessToken) {
        return null
      }
      accessToken = newAccessToken.data.accessToken
      try {
        user = jwtDecode(accessToken)
      } catch (error) {
        signOut()
        toast.error('Please login again', { position: 'bottom-right' })
        return null
      }
    }
    const isExpired = dayjs.unix(user.exp!).diff(dayjs()) < 1
    if (isExpired) {
      const newAccessToken = await refreshToken(accessToken)
      if (!newAccessToken) {
        return null
      }
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
