import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
      fullname,
    }: {
      email: string
      password: string
      fullname: string
    }) => {
      const res = await fetch('http://localhost:8017/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullname }),
      })
      const result = await res.json()
      console.log(result)
      if (result.hasOwnProperty('message')) {
        toast.error(result.message, { position: 'bottom-right' })
        return
      }
      return result.data
    },
  })
