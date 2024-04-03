import React from 'react'
import './style.scss'
import Image from 'next/image'


export default function ServicesInfo() {
  return (
    <section className='service-info'>
      <div className='container'>
        <div className='service-info-container' data-aos='fade-up' data-aos-duration='1500'>
          <p className='service-info-title'>What we Grow</p>
          <p className='service-info-sub-title'>Better Agriculture for Better Future</p>
          <div className='service-info-box'>
            <div className='box text-right'>
              <div className='child-box'>
                <p className='child-box__title'>Daily Product</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
              <div className='child-box'>
                <p className='child-box__title'>Store Services</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
              <div className='child-box'>
                <p className='child-box__title'>Delivery Services</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
            </div>
            <div className='center-box'>
              <Image src={'/assets/img/snack-services.webp'} alt='' className='center-box__img' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' />
            </div>
            <div className='box text-left'>
              <div className='child-box'>
                <p className='child-box__title'>Agricultural Services</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
              <div className='child-box'>
                <p className='child-box__title'>Organic Products</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
              <div className='child-box'>
                <p className='child-box__title'>Fresh Vegetables</p>
                <p className='child-box__text'>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremqlaudantium. Sed ut
                  perspiciatis
                </p>
              </div>
            </div>
          </div>
          <button className='btn btn-service'>Explore More</button>
        </div>
      </div>
    </section>
  )
}
