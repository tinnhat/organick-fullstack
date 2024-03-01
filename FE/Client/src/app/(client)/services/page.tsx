import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import Videos from '@/app/components/videos'
import ServicesInfo from '@/app/components/servicesInfo'

type Props = {}

export default function Services({}: Props) {
  return (
    <div className='service'>
      <BannerImg pic={'/assets/img/servicesBanner.jpg'} />
      <ServicesInfo />
      <Videos />
    </div>
  )
}
