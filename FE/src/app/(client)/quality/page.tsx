import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import ServiceSingle from '@/app/components/servicesSingle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quality',
}

type Props = {}

export default function Quality({}: Props) {
  return (
    <div className='quality'>
      <BannerImg pic={'/assets/img/qualityBanner.webp'} />
      <ServiceSingle />
    </div>
  )
}