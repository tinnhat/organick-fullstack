import About from '@/app/components/about'
import BannerImg from '@/app/components/bannerImg'
import OfferProduct from '@/app/components/offerProduct'
import Team from '@/app/components/team'
import WhyChooseUs from '@/app/components/whyChooseUs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}
type Props = {}

export default function AboutPage({}: Props) {
  return (
    <div className='about-page'>
      <BannerImg pic={'/assets/img/aboutBanner.webp'} />
      <About />
      <WhyChooseUs />
      <Team />
      <OfferProduct />
    </div>
  )
}
