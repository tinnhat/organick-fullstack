import React from 'react'
import BannerImg from '@/app/components/bannerImg'
import './style.scss'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default function Portfolio() {
  return (
    <div className='portfolio'>
      <BannerImg pic={'/assets/img/portfolioBanner.webp'} />
      <div className='container'>
        <div className='portfolio-container'>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port1.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />
            <p className='box-info__name'>Green & Tasty Lemon</p>
            <p className='box-info__tag'>Fruits</p>
          </div>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port2.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />

            <p className='box-info__name'>Organic Carrot</p>
            <p className='box-info__tag'>Farmer</p>
          </div>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port3.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />

            <p className='box-info__name'>Organic Betel Leaf</p>
            <p className='box-info__tag'>Leaf</p>
          </div>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port4.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />

            <p className='box-info__name'>Black Raspberry</p>
            <p className='box-info__tag'>Farmer</p>
          </div>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port5.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />

            <p className='box-info__name'>Honey Orange</p>
            <p className='box-info__tag'>Farmer</p>
          </div>
          <div className='box-info' data-aos='fade-up' data-aos-duration='1000'>
            <Image
              src={'/assets/img/port6.webp'}
              alt=''
              className='box-info__img'
              fill
              sizes='100vw'
            />

            <p className='box-info__name'>Green & Tasty Lemon</p>
            <p className='box-info__tag'>Fruits</p>
          </div>
        </div>
      </div>
    </div>
  )
}
