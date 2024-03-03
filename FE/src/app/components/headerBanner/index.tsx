import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './style.scss'
type Props = {}

export default function HeaderBanner({}: Props) {
  return (
    <section className='header-banner' data-aos='zoom-in-down'>
      <div className='container'>
        <div className='banner-content'>
          <p className='banner-content-title'>100% Natural Food</p>
          <div className='banner-content-text'>Choose the best healthier way of life</div>
          <button className='btn bkg-yellow btn-explore'>
            Explore Now
            <span>
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
