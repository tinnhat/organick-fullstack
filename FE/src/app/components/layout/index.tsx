import Footer from '../footer'
import Header from '../header'
import NewLatter from '../newslatter'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <NewLatter />
      <Footer />
    </>
  )
}

export default RootLayout
