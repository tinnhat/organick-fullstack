import Image from 'next/image'
import React from 'react'
import './style.scss'
type Props = {
  pic: string
}

export default function BannerImg({ pic }: Props) {
  return (
    <section className='banner-img'>
      <Image src={pic} alt='' className='banner-img__show' layout='fill' />
    </section>
  )
}
