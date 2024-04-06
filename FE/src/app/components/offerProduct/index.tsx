import React from 'react'
import './style.scss'
import Image from 'next/image'



export default function OfferProduct() {
  return (
    <section className='offer-product'>
      <div className='container'>
        <div className='offer-product-container' data-aos='fade-up' data-aos-duration='1000'>
          <p className='offer-product-title'>About Us</p>
          <p className='offer-product-sub-title'>What We Offer for You</p>
          <div className='list-product'>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct1.webp'} alt='' className='product-info-img' layout='fill'  />
              <p className='product-name'>Spicy</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct2.webp'} alt='' className='product-info-img' layout='fill'  />
              <p className='product-name'>Nuts & Feesd</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct3.webp'} alt='' className='product-info-img' layout='fill'  />
              <p className='product-name'>Fruits</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct4.webp'} alt='' className='product-info-img' layout='fill'  />
              <p className='product-name'>Vegetable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
