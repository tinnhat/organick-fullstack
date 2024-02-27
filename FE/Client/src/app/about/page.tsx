import React from 'react'
import About from '../components/about'
import BannerImg from '../components/bannerImg'
import WhyChooseUs from '../components/whyChooseUs'
import Team from '../components/team'
import OfferProduct from '../components/offerProduct'

type Props = {}

export default function AboutPage({}: Props) {
  return (
    <div className='about-page'>
      <BannerImg pic={'/assets/img/aboutBanner.png'} />
      <About />
      <WhyChooseUs />
      <Team />
      <OfferProduct />
    </div>
  )
}
