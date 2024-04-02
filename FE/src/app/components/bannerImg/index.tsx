import Image from 'next/image'
import React from 'react'
import './style.scss'
type Props = {
  pic: string
}

export default function BannerImg({ pic }: Props) {
  return (
    <section className='banner-img'>
      <Image src={pic} alt='' className='banner-img__show' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' priority />
    </section>
  )
}
