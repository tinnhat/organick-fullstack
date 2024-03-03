import React from 'react'
import About from '@/app/components/about'
import BannerImg from '@/app/components/bannerImg'
import WhyChooseUs from '@/app/components/whyChooseUs'
import Team from '@/app/components/team'
import OfferProduct from '@/app/components/offerProduct'
import AOSComponent from '@/app/components/aos'

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
