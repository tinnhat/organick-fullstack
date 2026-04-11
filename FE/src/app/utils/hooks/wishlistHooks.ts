import { useMutation, useQuery } from '@tanstack/react-query'
import useFetch from '@/app/utils/useFetch'
import { toast } from 'sonner'

export const useGetWishlistQuery = () => {
  const fetchApi = useFetch()
  return useQuery({
    queryKey: ['User Wishlist'],
    queryFn: async () => {
      const res = await fetchApi('/v1/wishlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return []
      }
      return res.data.data || []
    },
  })
}

export const useAddToWishlistMutation = () => {
  const fetchApi = useFetch()
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetchApi('/v1/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })
      if (res.data.hasOwnProperty('message') && !res.data.success) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
}

export const useRemoveFromWishlistMutation = () => {
  const fetchApi = useFetch()
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetchApi(`/v1/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.data.hasOwnProperty('message') && !res.data.success) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
}

export const useToggleWishlistMutation = () => {
  const fetchApi = useFetch()
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetchApi('/v1/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })
      if (res.data.hasOwnProperty('message') && !res.data.success) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })
}
