import React from 'react'
import BannerImg from '../components/bannerImg'
import Videos from '../components/videos'
import ServicesInfo from '../components/servicesInfo'

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
