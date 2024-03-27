import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetOrdersQuery = (fetchApi: any) =>
  useQuery({
    queryKey: ['all Orders'],
    queryFn: async () => {
      const res = await fetchApi('/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.hasOwnProperty('message')) {
        toast.error(res.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useGetOrderDetailQuery = (fetchApi: any, id: string) =>
  useQuery({
    queryKey: ['order by Id', id],
    queryFn: async () => {
      const res = await fetchApi(`/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.hasOwnProperty('message')) {
        toast.error(res.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
export const useCreateOrderMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchApi('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = res.data
      return result.data
    },
  })

export const useGetOrdersOfUserQuery = (
  fetchApi: any,
  id: string,
  page: number,
  pageSize: number
) =>
  useQuery({
    queryKey: ['orders of user', id],
    queryFn: async () => {
      const res = await fetchApi(`/orders/user/${id}/?page=${page}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = res.data
      return result.data
    },
  })
