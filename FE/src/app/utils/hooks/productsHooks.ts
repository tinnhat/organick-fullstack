import { useQuery } from '@tanstack/react-query'

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
