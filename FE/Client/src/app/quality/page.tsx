import React from 'react'
import BannerImg from '../components/bannerImg'
import ServiceSingle from '../components/servicesSingle'

type Props = {}

export default function Quality({}: Props) {
  return (
    <div className='quality'>
      <BannerImg pic={'/assets/img/qualityBanner.png'} />
      <ServiceSingle />
    </div>
  )
}