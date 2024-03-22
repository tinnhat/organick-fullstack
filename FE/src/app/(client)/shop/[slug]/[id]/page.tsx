import BannerImg from '@/app/components/bannerImg'
import SingleProductDetail from '@/app/components/singleProductDetail'

type Props = {
  params: { slug: string }
}

export default function DetailProduct({ params }: Props) {
  return (
    <section className='shop-single'>
      <BannerImg pic={'/assets/img/shop-single.jpg'} />
      <SingleProductDetail params={params} />
    </section>
  )
}
