import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        token: { label: 'Token', type: 'text' }
      },
      async authorize(credentials: any, req: any): Promise<any> {
        const { email, password } = credentials
        //call api login
        const response = await fetch('http://localhost:8017/v1/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        const result = await response.json()
        if (result.message) {
          return { error: result.message }
        }
        else {
          const { data } = result
          return {
            _id: data.user._id,
            name: data.user.fullname,
            email: data.user.email,
            isAdmin: data.user.isAdmin,
            access_token: data.accessToken
          }
        }
      }
    })
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
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

      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin
      }

      if (user?._id) {
        token._id = user._id
      }

      if (user?.access_token) {
        token.access_token = user.access_token
      }
      token.exp = token.iat + 24 * 60 * 60
      return token
    },
    session: async ({ session, token }: any) => {
      session.expires = new Date(jwtDecode(token.access_token).exp! * 1000)
      session.user.session = token.session
      session.user._id = token._id
      session.user.access_token = token.access_token
      session.user.isAdmin = token.isAdmin
      return session
    }
  }
}
