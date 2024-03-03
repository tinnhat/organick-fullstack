import Image from 'next/image'
import React from 'react'
import './style.scss'
type Props = {}

export default function WhoWeAre({}: Props) {
  return (
    <section className='whoWeAre'>
      <div className='whoWeAre-picture-box'>
        <Image src={'/assets/img/whoweare.png'} alt='' width={200} height={200} />
      </div>
      <div className='whoWeAre-content-box'>
        <div className='content-box' data-aos='fade-up' data-aos-duration='500'>
          <p className='content-title'>Eco Friendly</p>
          <p className='content-header'>Econis is a Friendly Organic Store</p>
          <p className='content-text'>Start with Our Company First</p>
          <p className='content-sub-text'>
            Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremque laudantium. Sed ut
            perspiciatis.
          </p>
          <p className='content-text'>Learn How to Grow Yourself</p>
          <p className='content-sub-text'>
            Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremque laudantium. Sed ut
            perspiciatis.
          </p>
          <p className='content-text'>Farming Strategies of Today</p>
          <p className='content-sub-text'>
            Sed ut perspiciatis unde omnis iste natus error sit voluptat accusantium doloremque laudantium. Sed ut
            perspiciatis.
          </p>
        </div>
      </div>
    </section>
  )
}
