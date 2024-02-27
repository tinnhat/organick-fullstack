import React from 'react'
import './style.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'

type Props = {}

export default function Team({}: Props) {
  return (
    <section className='team'>
      <div className='container'>
        <div className='team-container'>
          <p className='team-title'>Team</p>
          <p className='team-sub-title'>Our Organic Experts</p>
          <p className='team-sub-text'>
            Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry's standard
            dummy text ever since the 1500s, when an unknown printer took a galley.
          </p>
          <div className='list-team'>
            <div className='member'>
              <Image src={'/assets/img/team1.png'} alt='' layout='fill' className='member-img' />
              <div className='member-info'>
                <p className='member-name'>Giovani Bacardo</p>
                <div className='member-contact'>
                  <p className='position'>Farmer</p>
                  <div className='box-icon'>
                    <FontAwesomeIcon icon={faFacebook} className='box-icon-item' />
                    <FontAwesomeIcon icon={faTwitter} className='box-icon-item' />
                  </div>
                </div>
              </div>
            </div>
            <div className='member'>
              <Image src={'/assets/img/team2.png'} alt='' layout='fill' className='member-img' />
              <div className='member-info'>
                <p className='member-name'>Marianne Loreno</p>
                <div className='member-contact'>
                  <p className='position'>Designer</p>
                  <div className='box-icon'>
                    <FontAwesomeIcon icon={faFacebook} className='box-icon-item' />
                    <FontAwesomeIcon icon={faTwitter} className='box-icon-item' />
                  </div>
                </div>
              </div>
            </div>
            <div className='member'>
              <Image src={'/assets/img/team3.png'} alt='' layout='fill' className='member-img' />
              <div className='member-info'>
                <p className='member-name'>Riga Pelore</p>
                <div className='member-contact'>
                  <p className='position'>Farmer</p>
                  <div className='box-icon'>
                    <FontAwesomeIcon icon={faFacebook} className='box-icon-item' />
                    <FontAwesomeIcon icon={faTwitter} className='box-icon-item' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
