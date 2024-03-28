import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetProductsQuery = (page: number, pageSize: number) =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8017/v1/products/?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
        }
      )
      const result = await res.json()
      return result.data
    },
  })
export const useGetAllProductsQuery = () =>
  useQuery({
    queryKey: ['All products'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8017/v1/products', {
        method: 'GET',
      })
      const result = await res.json()
      return result.data
    },
  })

export const useAddProductMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async ({
      name,
      description,
      quantity,
      price,
      priceSale,
      star,
      categoryId,
      file,
    }: {
      name: string
      description: string
      quantity: number
      price: number
      priceSale: number
      star: number
      categoryId: string
      file: any
    }) => {
      const data = new FormData()
      data.append('name', name)
      data.append('description', description)
      data.append('quantity', quantity.toString())
      data.append('price', price.toString())
      data.append('priceSale', priceSale.toString())
      data.append('star', star.toString())
      data.append('categoryId', categoryId.toString())
      if (file) data.append('file', file)

      const res = await fetchApi('/products', {
        method: 'POST',
        body: data,
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useEditProductMutation = (fetchApi: any, id: string) =>
  useMutation({
    mutationFn: async ({
      name,
      description,
      quantity,
      price,
      priceSale,
      star,
      categoryId,
      _destroy,
      file,
    }: {
      name: string
      description: string
      quantity: number
      price: number
      priceSale: number
      star: number
      categoryId: string
      _destroy: boolean
      file: any
    }) => {
      const data = new FormData()
      data.append('name', name)
      data.append('description', description)
      data.append('quantity', quantity.toString())
      data.append('price', price.toString())
      data.append('priceSale', priceSale.toString())
      data.append('star', star.toString())
      data.append('categoryId', categoryId.toString())
      data.append('_destroy', _destroy.toString())
      if (file) data.append('file', file)

      const res = await fetchApi(`/products/${id}`, {
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

export const useDeleteProductMutation = (fetchApi: any) =>
  useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/products/${id}`, {
        method: 'DELETE',
      })
      if (res.data.hasOwnProperty('message')) {
        toast.error(res.data.message, { position: 'bottom-right' })
        return
      }
      return res.data.data
    },
  })

export const useGetProductsOfferQuery = (page: number, pageSize: number) =>
  useQuery({
    queryKey: ['products show offer'],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8017/v1/products/?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
        }
      )
      const result = await res.json()
      return result.data
    },
  })

export const useGetProductByIdQuery = (id: string) =>
  useQuery({
    queryKey: ['product by id', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8017/v1/products/${id}`, {
        method: 'GET',
      })
      const result = await res.json()
      console.log(result)
      return result.data
    },
  })
