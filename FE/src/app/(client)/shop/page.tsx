import BannerImg from '@/app/components/bannerImg'
import DetailShop from '@/app/components/detailShop'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
}

export default function Shop() {
  return (
    <div className='shop-page'>
      <BannerImg pic={'/assets/img/shop-page.webp'} />
      <DetailShop />
    </div>
  )
}
