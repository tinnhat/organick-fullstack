import BannerImg from '@/app/components/bannerImg'
import RelatedProduct from '@/app/components/relatedProduct'
import SingleProductDetail from '@/app/components/singleProductDetail'
import React from 'react'

type Props = {}

export default function DetailProduct({}: Props) {
  return (
    <section className='shop-single'>
      <BannerImg pic={'/assets/img/shop-single.jpg'} />
      <SingleProductDetail />
      <RelatedProduct />
    </section>
  )
}
