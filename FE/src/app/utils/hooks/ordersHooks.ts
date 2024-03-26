import { useMutation, useQuery } from '@tanstack/react-query'

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

export const useGetOrdersOfUserQuery = (fetchApi: any, id: string, page: number, pageSize: number) =>
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