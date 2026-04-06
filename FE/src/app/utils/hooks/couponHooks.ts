import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface Coupon {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
  _destroy: boolean
  createdAt: string
  updatedAt: string
}

export const useGetCouponsQuery = () =>
  useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await fetch(`${process.env.HOST_BE}/coupons`, {
        method: 'GET',
      })
      const result = await res.json()
      return result.data || []
    },
  })

export const useGetCouponByIdQuery = (id: string) =>
  useQuery({
    queryKey: ['coupon by id', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.HOST_BE}/coupons/${id}`, {
        method: 'GET',
      })
      const result = await res.json()
      return result.data
    },
  })

export const useAddCouponMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async ({
      code,
      type,
      value,
      minOrder,
      maxUses,
      expiresAt,
      isActive,
    }: {
      code: string
      type: 'percentage' | 'fixed'
      value: number
      minOrder: number
      maxUses: number
      expiresAt: string
      isActive: boolean
    }) => {
      const res = await fetchApi('/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code,
          type,
          value,
          minOrder,
          maxUses,
          expiresAt,
          isActive,
        }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useEditCouponMutation = (fetchApi: any, id: string) =>
  useMutation({
    mutationFn: async ({
      code,
      type,
      value,
      minOrder,
      maxUses,
      expiresAt,
      isActive,
    }: {
      code: string
      type: 'percentage' | 'fixed'
      value: number
      minOrder: number
      maxUses: number
      expiresAt: string
      isActive: boolean
    }) => {
      const res = await fetchApi(`/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          code,
          type,
          value,
          minOrder,
          maxUses,
          expiresAt,
          isActive,
        }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useDeleteCouponMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/coupons/${id}`, {
        method: 'DELETE',
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useToggleCouponMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetchApi(`/coupons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isActive,
        }),
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useValidateCouponQuery = (code: string, enabled: boolean = false) =>
  useQuery({
    queryKey: ['validate coupon', code],
    queryFn: async () => {
      const res = await fetch(`${process.env.HOST_BE}/coupons/validate/${code}`, {
        method: 'GET',
      })
      const result = await res.json()
      return result
    },
    enabled: enabled && !!code,
  })
