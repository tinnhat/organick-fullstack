import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import ServiceSingle from '@/app/components/servicesSingle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quality',
}

export default function Quality() {
  return (
    <div className='quality'>
      <BannerImg pic={'/assets/img/qualityBanner.webp'} />
      <ServiceSingle />
    </div>
  )
}