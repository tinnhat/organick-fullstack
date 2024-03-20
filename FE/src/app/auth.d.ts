import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      _id?: string;
      isAdmin?: boolean;
      refreshToken?: string;
    } & DefaultSession['user'];
  }
  export interface User {
    _id?: string | null | undefined
    name?: string
    email?: string
    isAdmin?: boolean
    access_token?: string
    refreshToken?: string;
  }
}
