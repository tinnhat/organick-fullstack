import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials: any, req: any): Promise<any> {
        const { email, password } = credentials
        //call api login
        const response = await fetch('http://localhost:8017/v1/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const result = await response.json()
        if (result.message) {
          return { error: result.message }
        }
        else {
          const { data } = result
          return data
        }
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user }: any) {
      if (user.error) {
        throw new Error(user.error)
      }
      return true
    },
  }
}