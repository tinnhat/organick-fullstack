import BannerImg from '@/app/components/bannerImg'
import RelatedProduct from '@/app/components/relatedProduct'
import SingleProductDetail from '@/app/components/singleProductDetail'
import { useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  params: { slug: string }
}

export default function DetailProduct({ params }: Props) {
  return (
    <section className='shop-single'>
      <BannerImg pic={'/assets/img/shop-single.jpg'} />
      <SingleProductDetail params={params} />
      <RelatedProduct />
    </section>
  )
}
