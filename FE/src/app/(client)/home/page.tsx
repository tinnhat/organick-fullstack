import dynamic from 'next/dynamic'

const HeaderBanner = dynamic(() => import('@/app/components/headerBanner'))
const OfferBanner = dynamic(() => import('@/app/components/offerBanner'))
const About = dynamic(() => import('@/app/components/about'))
const ShopShow = dynamic(() => import('@/app/components/shopShow'))
const Counter = dynamic(() => import('@/app/components/counter'))
const Offer = dynamic(() => import('@/app/components/offer'))
const WhoWeAre = dynamic(() => import('@/app/components/whoWeAre'))
const Gallery = dynamic(() => import('@/app/components/gallery'))
const Blog = dynamic(() => import('@/app/components/blog'))

export default function Home() {
  return (
    <div className='home-page'>
      <HeaderBanner />
      <OfferBanner />
      <About />
      <ShopShow />
      <Counter />
      <Offer />
      <WhoWeAre />
      <Gallery />
      <Blog />
    </div>
  )
}