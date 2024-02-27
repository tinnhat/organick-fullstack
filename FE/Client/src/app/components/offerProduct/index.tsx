import React from 'react'
import './style.scss'
import Image from 'next/image'

type Props = {}

export default function OfferProduct({}: Props) {
  return (
    <section className='offer-product'>
      <div className='container'>
        <div className='offer-product-container'>
          <p className='offer-product-title'>About Us</p>
          <p className='offer-product-sub-title'>What We Offer for You</p>
          <div className='list-product'>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct1.jpg'} alt='' className='product-info-img' layout='fill' />
              <p className='product-name'>Spicy</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct2.jpg'} alt='' className='product-info-img' layout='fill' />
              <p className='product-name'>Nuts & Feesd</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct3.jpg'} alt='' className='product-info-img' layout='fill' />
              <p className='product-name'>Fruits</p>
            </div>
            <div className='product-info'>
              <Image src={'/assets/img/offerProduct4.jpg'} alt='' className='product-info-img' layout='fill' />
              <p className='product-name'>Vegetable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
