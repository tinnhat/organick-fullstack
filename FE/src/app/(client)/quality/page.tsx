import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import ServiceSingle from '@/app/components/servicesSingle'

type Props = {}

export default function Quality({}: Props) {
  return (
    <div className='quality'>
      <BannerImg pic={'/assets/img/qualityBanner.webp'} />
      <ServiceSingle />
    </div>
  )
}