import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './(client)/_index.scss'
const inter = Inter({ subsets: ['latin'] })
config.autoAddCss = false
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
