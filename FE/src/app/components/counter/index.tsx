import React from 'react'
import './style.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
type Props = {}

export default function Counter({}: Props) {
  return (
    <section className='counter'>
      <div className='container'>
        <div className='counter-container'>
          <p className='counter-title' data-aos='fade-up' data-aos-duration='500'>
            Testimonial
          </p>
          <p className='counter-question' data-aos='fade-up' data-aos-duration='800'>
            What Our Customer Saying?
          </p>
          <div className='counter-people' data-aos='fade-up' data-aos-duration='1200'>
            <Image
              src={'/assets/img/avatar.jpg'}
              alt=''
              className='avatar-counter'
              width={200}
              height={200}
            />
            <div className='box-start'>
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className='counter-people-text'>
              Simply dummy text of the printing and typesetting industry. Lorem Ipsum simply dummy
              text of the printing and typesetting industry. Lorem Ipsum has been.
            </p>
            <p className='counter-people-name'>Sara Taylor</p>
            <p className='counter-people-position'>Consumer</p>
          </div>
          <div className='counter-box' data-aos='fade-up' data-aos-duration='1500'>
            <div className='circle-counter'>
              <p className='circle-counter-number'>100%</p>
              <p className='circle-counter-text'>Organic</p>
            </div>
            <div className='circle-counter'>
              <p className='circle-counter-number'>285</p>
              <p className='circle-counter-text'>Active Product</p>
            </div>
            <div className='circle-counter'>
              <p className='circle-counter-number'>350+</p>
              <p className='circle-counter-text'>Organic Orcharts</p>
            </div>
            <div className='circle-counter'>
              <p className='circle-counter-number'>25+</p>
              <p className='circle-counter-text'>Years of Farming</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
