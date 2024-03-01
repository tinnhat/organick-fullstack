import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import DetailShop from '@/app/components/detailShop'

type Props = {}

export default function Shop({}: Props) {
  return (
    <div className='shop-page'>
      <BannerImg pic={'/assets/img/shop-page.png'} />
      <DetailShop />
    </div>
  )
}
