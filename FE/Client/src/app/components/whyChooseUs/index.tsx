import React from 'react'
import './style.scss'
import Image from 'next/image'

type Props = {}

export default function WhyChooseUs({}: Props) {
  return (
    <section className='choos'>
      <div className='container'>
        <div className='choos-container' data-aos='fade-up' data-aos-duration='1000'>
          <div className='choos-content-box'>
            <p className='title'>Why choose us?</p>
            <p className='sub-title'>We do not buy from the open market & traders.</p>
            <p className='content-text'>
              Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry&apos;s
              standard the 1500s, when an unknown
            </p>
            <div className='sub-info-box'>
              <i className='fa-solid fa-circle-dot'></i> 100% Natural Product
            </div>
            <p className='sub-info-text'>Simply dummy text of the printing and typesetting industry Lorem Ipsum</p>
            <div className='sub-info-box'>
              <i className='fa-solid fa-circle-dot'></i> Increases resistance
            </div>
            <p className='sub-info-text'>
              Filling, and temptingly healthy, our Biona Organic Granola with Wild Berries is just the thing
            </p>
          </div>
          <div className='choos-img-box'>
            <Image src={'/assets/img/whyChooseUs.png'} alt='' className='choos-img' layout='fill' />
          </div>
        </div>
        <div className='choos-info-box'>
          <div className='tab'>
            <div className='box-icon'>
              <Image src={'/assets/img/Icon-choose-1.svg'} alt='' width={50} height={50} />
            </div>
            <p className='tab-title'>Return Policy</p>
            <p className='tab-text'>Simply dummy text of the printintypesetting industry.</p>
          </div>
          <div className='tab'>
            <div className='box-icon'>
              <Image src={'/assets/img/Icon-choose-2.png'} alt='' width={50} height={50} />
            </div>
            <p className='tab-title'>Return Policy</p>
            <p className='tab-text'>Simply dummy text of the printintypesetting industry.</p>
          </div>
          <div className='tab'>
            <div className='box-icon'>
              <Image src={'/assets/img/Icon-choose-3.png'} alt='' width={50} height={50} />
            </div>
            <p className='tab-title'>Return Policy</p>
            <p className='tab-text'>Simply dummy text of the printintypesetting industry.</p>
          </div>
          <div className='tab'>
            <div className='box-icon'>
              <Image src={'/assets/img/Icon-choose-4.png'} alt='' width={50} height={50} />
            </div>
            <p className='tab-title'>Return Policy</p>
            <p className='tab-text'>Simply dummy text of the printintypesetting industry.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
