import About from './components/about'
import Blog from './components/blog'
import Counter from './components/counter'
import Gallery from './components/gallery'
import HeaderBanner from './components/headerBanner'
import LoadingCustom from './components/loading'
import Offer from './components/offer'
import OfferBanner from './components/offerBanner'
import ShopShow from './components/shopShow'
import WhoWeAre from './components/whoWeAre'

export default function Home() {
  return (
    <main>
      <HeaderBanner />
      <OfferBanner />
      <About />
      <ShopShow />
      <Counter />
      <Offer />
      <WhoWeAre />
      <Gallery />
      <Blog />
    </main>
  )
}
