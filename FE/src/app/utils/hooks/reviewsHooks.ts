import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetch from '../useFetch'

export const useGetReviewsByProductIdQuery = (productId: string) =>
  useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return null
      const res = await fetch(`${process.env.HOST_BE}/reviews?productId=${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await res.json()
      if (result.hasOwnProperty('message')) {
        toast.error(result.message, { position: 'bottom-right' })
        return null
      }
      return result.data
    },
  })

export const useAddReviewMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: string
      rating: number
      comment: string
    }) => {
      const res = await fetchApi(`/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return null
      }
      toast.success('Review submitted successfully', { position: 'bottom-right' })
      return res.data.data
    },
  })

export const useEditReviewMutation = (fetchApi: any, reviewId: string) =>
  useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const res = await fetchApi(`/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return null
      }
      toast.success('Review updated successfully', { position: 'bottom-right' })
      return res.data.data
    },
  })

export const useDeleteReviewMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await fetchApi(`/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return null
      }
      toast.success('Review deleted successfully', { position: 'bottom-right' })
      return res.data.data
    },
  })
