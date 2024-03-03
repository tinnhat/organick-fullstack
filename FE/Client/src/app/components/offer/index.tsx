import React from 'react'
import './style.scss'
import Image from 'next/image'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
type Props = {}

export default function Offer({}: Props) {
  return (
    <section className='offer'>
      <div className='container'>
        <div className='offer-container'>
          <div className='header-offer-box'>
            <div className='left'>
              <p className='left-title'>Offer</p>
              <p className='left-text'>We Offer Organic For You</p>
            </div>
            <button className='btn btn-offer'>
              View All Product
              <span>
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
          </div>
          <div className='row-products' data-aos='fade-up' data-aos-duration='500'>
            <div className='product-box'>
              <div className='product-tag'>Vegetable</div>
              <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />
              <p className='product-name'>Calabrese Broccoli</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$13.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Fresh</div>
              <Image src={'/assets/img/product2.png'} alt='' className='product-img' layout='fill' />
              <p className='product-name'>Fresh Banana Fruites</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$14.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Millets</div>
              <Image src={'/assets/img/product3.png'} alt='' className='product-img' layout='fill' />
              <p className='product-name'>White Nuts</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$15.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Vegetable</div>
              <Image src={'/assets/img/product4.png'} alt='' className='product-img' layout='fill' />
              <p className='product-name'>Vegan Red Tomato</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$17.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                  <FontAwesomeIcon className='icon-star' icon={faStar} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
