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
          return {
            _id: data.user._id,
            fullname: data.user.fullname,
            email: data.user.email,
            accessToken: result.accessToken,
          }
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
    async jwt({ token, user }: any) {
      if (user?.session) {
        token.session = user.session
      }

      if (user?._id) {
        token._id = user._id
      }

      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      token.exp = token.iat + 60 * 60 * 24
      return token
    },
    session: async ({ session, token }: any) => {
      session.expires = new Date(token.exp * 1000).toISOString();
      session.user.session = token.session
      session.user._id = token._id
      session.user.accessToken = token.accessToken

      return session
    },
  },
}
