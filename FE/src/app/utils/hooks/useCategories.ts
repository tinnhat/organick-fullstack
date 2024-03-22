import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8017/v1/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await res.json()
      if (result.hasOwnProperty('message')) {
        toast.error(result.message, { position: 'bottom-right' })
        return
      }
      return result.data
    },
  })
