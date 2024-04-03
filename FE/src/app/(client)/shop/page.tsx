import BannerImg from '@/app/components/bannerImg'
import DetailShop from '@/app/components/detailShop'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Shop',
}

type Props = {}

export default function Shop({}: Props) {
  return (
    <div className='shop-page'>
      <BannerImg pic={'/assets/img/shop-page.webp'} />
      <DetailShop />
    </div>
  )
}
