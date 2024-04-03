import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode'

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
        const response = await fetch(`${process.env.HOST_BE}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const result = await response.json()
        if (result.message) {
          return { error: result.message }
        } else {
          const { data } = result
          return {
            _id: data.user._id,
            name: data.user.fullname,
            email: data.user.email,
            isAdmin: data.user.isAdmin,
            access_token: data.accessToken,
            refreshToken: data.user.refreshToken,
          }
        }
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60,
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
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          ...session.user,
        }
      }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
}
