import React from 'react'
import './style.scss'
type Props = {}

export default function OfferBanner({}: Props) {
  return (
    <section className='offer-banner'>
      <div className='container'>
        <div className='offer-banner-container'>
          <div
            className='offer-banner-box bkg-left text-white'
            data-aos='fade-right'
            data-aos-duration='500'
          >
            <p className='offer-banner-title'>Natural!!</p>
            <p className='offer-banner-text'>Get Garden Fresh Fruits</p>
          </div>
          <div
            className='offer-banner-box bkg-right text-green-bold'
            data-aos='fade-left'
            data-aos-duration='500'
          >
            <p className='offer-banner-title'>Offer!!</p>
            <p className='offer-banner-text'>Get 10% off on Vegetables</p>
          </div>
        </div>
      </div>
    </section>
  )
}
