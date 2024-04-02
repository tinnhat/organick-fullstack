import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import './style.scss'
type Props = {}

export default function About({}: Props) {
  return (
    <section className='about'>
      <div className='container'>
        <div className='about-container' data-aos='fade-up' data-aos-duration='1000'>
          <div className='about-box-img'></div>
          <div className='about-box-content'>
            <p className='about-title'>About Us</p>
            <p className='about-sub-title'>We Believe in Working Accredited Farmers</p>
            <p className='about-text'>
              Simply dummy text of the printing and typesetting industry. Lorem had ceased to been
              the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer
              took a galley.
            </p>
            <div className='about-sub-box'>
              <p className='about-sub-icon'>
                <Image
                  src={'/assets/img/Group1.svg'}
                  alt=''
                  className='sub-box-icon'
                  width={50}
                  height={50}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </p>
              <div className='sub-box-content'>
                <p className='sub-box-content-title'>Organic Foods Only</p>
                <p className='sub-box-content-text'>
                  Simply dummy text of the printing and typesetting industry. Lorem Ipsum
                </p>
              </div>
            </div>
            <div className='about-sub-box'>
              <p className='about-sub-icon'>
                <Image
                  src={'/assets/img/Group2.webp'}
                  alt=''
                  className='sub-box-icon'
                  width={50}
                  height={50}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </p>
              <div className='sub-box-content'>
                <p className='sub-box-content-title'>Quality Standards</p>
                <p className='sub-box-content-text'>
                  Simply dummy text of the printing and typesetting industry. Lorem Ipsum
                </p>
              </div>
            </div>
            <button className='btn btn-about'>
              Shop Now
              <span>
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
