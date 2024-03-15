import About from '@/app/components/about'
import Blog from '@/app/components/blog'
import Counter from '@/app/components/counter'
import Gallery from '@/app/components/gallery'
import HeaderBanner from '@/app/components/headerBanner'
import Offer from '@/app/components/offer'
import OfferBanner from '@/app/components/offerBanner'
import ShopShow from '@/app/components/shopShow'
import WhoWeAre from '@/app/components/whoWeAre'

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