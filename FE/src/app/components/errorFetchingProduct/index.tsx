import React from 'react'
import './style.scss'
import Image from 'next/image'


export default function ErrorFetchingProduct() {
  return (
    <div className='error-fetching-container'>
      <Image width={300} height={300} alt='' src='/images/backgrounds/error.webp' />
      <h1>
        <span>500</span> <br />
        Internal server error
      </h1>
      <p>We are currently trying to fix the problem. Please try again later</p>
    </div>
  )
}
