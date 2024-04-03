import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import Videos from '@/app/components/videos'
import ServicesInfo from '@/app/components/servicesInfo'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
}

type Props = {}

export default function Services({}: Props) {
  return (
    <div className='service'>
      <BannerImg pic={'/assets/img/servicesBanner.webp'} />
      <ServicesInfo />
      <Videos />
    </div>
  )
}
