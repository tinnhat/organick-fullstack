import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetUserInfoQuery = (fetchApi: any, id: string) =>
  useQuery({
    queryKey: ['User Information'],
    queryFn: async () => {
      const res = await fetchApi(`/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useGetUserInfoByIdQuery = (fetchApi: any, id: string) =>
  useQuery({
    queryKey: ['User Information by id', id],
    queryFn: async () => {
      const res = await fetchApi(`/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
      fullname,
      isAdmin = false,
      isConfirmed = false,
      file,
    }: {
      email: string
      password: string
      fullname: string
      isAdmin?: boolean
      isConfirmed?: boolean
      file: any
    }) => {
      const data = new FormData()
      data.append('fullname', fullname)
      data.append('email', email)
      data.append('password', password)
      if (isAdmin) data.append('isAdmin', isAdmin.toString())
      if (isConfirmed) data.append('isConfirmed', isConfirmed.toString())
      if (file) data.append('file', file)

      const res = await fetch(`${process.env.HOST_BE}/users`, {
        method: 'POST',
        body: data,
      })
      const result = await res.json()
      if (result.hasOwnProperty('message')) {
        toast.error(result.message, { position: 'bottom-right' })
        return
      }
      return result.data
    },
  })

export const useUpdateUserInfoMutation = (fetchApi: any, id: string) =>
  useMutation({
    mutationFn: async ({
      fullname,
      file,
      isAdmin = false,
      isConfirmed = false,
      _destroy = false,
    }: {
      fullname: string
      file: any
      isAdmin?: boolean
      isConfirmed?: boolean
      _destroy?: boolean
    }) => {
      const data = new FormData()
      data.append('fullname', fullname)
      if (isAdmin) data.append('isAdmin', isAdmin.toString())
      if (isConfirmed) data.append('isConfirmed', isConfirmed.toString())
      if (_destroy) data.append('_destroy', _destroy.toString())
      if (file) {
        data.append('file', file)
      }
      const res = await fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: data,
      })

      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }

      return res.data.data
    },
  })

export const useUpdatePasswordMutation = (fetchApi: any, id: string) =>
  useMutation({
    mutationFn: async ({ password, newPassword }: { password: string; newPassword: string }) => {
      const res = await fetchApi(`/users/change-password/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, newPassword }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useGetAllUsersQuery = (fetchApi: any) =>
  useQuery({
    queryKey: ['User List'],
    queryFn: async () => {
      const res = await fetchApi('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useDeleteUserMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await fetchApi(`/users/${id}`, {
        method: 'DELETE',
      })
      if (result.data.hasOwnProperty('message')) {
        toast.error(result.data.message, { position: 'bottom-right' })
        return
      }
      return result.data.data
    },
  })

export const useResetPasswordUserQuery = (fetchApi: any) =>
  useMutation({
    mutationFn: async (email: string) => {
      const res = await fetchApi('/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
