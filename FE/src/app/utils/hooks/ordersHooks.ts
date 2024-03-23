import { useMutation } from '@tanstack/react-query'

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
