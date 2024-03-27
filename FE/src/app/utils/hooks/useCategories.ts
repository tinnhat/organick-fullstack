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

export const useDeleteCategoryMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await fetchApi(`/categories/${id}`, {
        method: 'DELETE',
      })
      if (result.data.hasOwnProperty('message')) {
        toast.error(result.data.message, { position: 'bottom-right' })
        return
      }
      return result.data.data
    },
  })

export const useGetCategoryInfoByIdQuery = (fetchApi: any, id: string) =>
  useQuery({
    queryKey: ['Category Information by id', id],
    queryFn: async () => {
      const res = await fetchApi(`/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.data.data
    },
  })
export const useUpdateCategoryInfoMutation = (fetchApi: any, id: string) =>
  useMutation({
    mutationFn: async ({ name, _destroy = false }: { name: string; _destroy?: boolean }) => {
      const res = await fetchApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          _destroy,
        }),
      })

      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }

      return res.data.data
    },
  })

export const useAddCategoryInfoMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async ({ name, _destroy }: { name: string; _destroy: boolean }) => {
      const res = await fetchApi('/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, _destroy }),
      })

      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }

      return res.data.data
    },
  })
