import React from 'react'
import './_notFound.scss'
import Link from 'next/link'
type Props = {}

export default function NotFound({}: Props) {
  return (
    <section className='error'>
      <div className='container'>
        <div className='err-container'>
          <p className='title'>404</p>
          <p className='sub-title'>Page not found</p>
          <p className='text'>The page you are looking for doesn't exist or has been moved</p>
          <Link href={'/'} className='btn btn-error'>
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  )
}
