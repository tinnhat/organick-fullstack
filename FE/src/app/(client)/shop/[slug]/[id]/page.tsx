import BannerImg from '@/app/components/bannerImg'
import SingleProductDetail from '@/app/components/singleProductDetail'
import { Metadata } from 'next'
type Props = {
  params: { slug: string; id: string }
}

export async function generateStaticParams() {
  if (!process.env.HOST_BE) return []
  const res = await fetch(`${process.env.HOST_BE}/products`, {
    method: 'GET',
  })
  const result = await res.json()
  return result.data.map((item: any) => ({ slug: item.slug, id: item._id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.HOST_BE}/products/${params.id}`, {
      method: 'GET',
    })
    const result = await res.json()

    if (!result?.data?.name) {
      return { title: 'Product Not Found' }
    }

    return {
      title: result.data.name,
      description: result.data.description,
    }
  } catch {
    return { title: 'Product' }
  }
}

export default function DetailProduct({ params }: Props) {
  return (
    <section className='shop-single'>
      <BannerImg pic={'/assets/img/shop-single.webp'} />
      <SingleProductDetail params={params} />
    </section>
  )
}
