import Link from 'next/link'
import Footer from './components/footer'
import Header from './components/header'
// import '@fortawesome/fontawesome-svg-core/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import './_notFound.scss'
import './(client)/_index.scss'

type Props = {}

export default function NotFound({}: Props) {
  return (
    <>
      <Header />
      <section className='error'>
        <div className='container'>
          <div className='err-container'>
            <p className='title'>404</p>
            <p className='sub-title'>Page not found</p>
            <p className='text'>
              The page you are looking for doesn&apos;t exist or has been moved
            </p>
            <Link href={'/'} className='btn btn-error'>
              Go to Homepage
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
