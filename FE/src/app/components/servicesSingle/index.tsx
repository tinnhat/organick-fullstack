/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import './style.scss'
import Image from 'next/image'
type Props = {}

export default function ServiceSingle({}: Props) {
  return (
    <section className='service-single'>
      <div className='container'>
        <div className='ss-container'>
          <Image
            src={'/assets/img/PhotoSS.png'}
            alt=''
            className='ss-img'
            layout='fill'
            data-aos='fade-up'
            data-aos-duration='1000'
          />
          <div className='ss-box__info' data-aos='fade-up' data-aos-duration='2000'>
            <p className='ss-box__title'>Organic Store Services</p>
            <p className='ss-box__text'>
              t is a long established fact that a reader will be distracted by the readable content
              of a page when looking a layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English.
            </p>
            <p className='ss-box__text'>
              Many desktop publishing packages and web page editors now use Lorem Ipsum as their
              default model text, and auncover many web sites still in their infancy. Various
              versions have evolved over the years
            </p>
            <div className='ss-box__img'>
              <div className='box-img'>
                <Image src={'/assets/img/pic1.png'} alt='' className='box-img__img' layout='fill' />
              </div>
              <div className='box-content'>
                <p className='box-content__title'>Why Organic</p>
                <p className='box-content__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat. page editors now use
                  Lorem Ipsum as their default model text, and auncover.
                </p>
              </div>
            </div>
            <div className='ss-box__img'>
              <div className='box-content'>
                <p className='box-content__title'>Speciality Produce</p>
                <p className='box-content__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat. page editors now use
                  Lorem Ipsum as their default model text, and auncover.
                </p>
              </div>
              <div className='box-img'>
                <Image src={'/assets/img/pic2.jpg'} alt='' className='box-img__img' layout='fill' />
              </div>
            </div>
            <p className='ss-box__sub-title'>We farm your land</p>
            <p className='ss-box__text'>
              It is a long established fact that a reader will be distracted by the readable content
              of a page when looking a layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English.
            </p>
            <div className='ss-box-quantity'>
              <div className='quantity-box'>
                <p className='number'>01</p>
                <p className='text'>Best quality support</p>
              </div>
              <div className='quantity-box'>
                <p className='number'>02</p>
                <p className='text'>Money back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
