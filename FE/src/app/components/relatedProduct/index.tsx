import Image from 'next/image'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'

import './style.scss'
type Props = {}

export default function RelatedProduct({}: Props) {
  return (
    <section className='related-product'>
      <div className='container'>
        <div className='offer-container'>
          <div className='header-offer-box'>
            <p>Related Products</p>
          </div>
          <div className='row-products'>
            <div className='product-box'>
              <div className='product-tag'>Vegetable</div>
              <Image src={'/assets/img/product1.webp'} alt='' className='product-img' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' />
              <p className='product-name'>Calabrese Broccoli</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$13.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Fresh</div>
              <Image src={'/assets/img/product2.webp'} alt='' className='product-img' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' />
              <p className='product-name'>Fresh Banana Fruites</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$14.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                  <FontAwesomeIcon icon={faStarSolid} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Millets</div>
              <Image src={'/assets/img/product3.webp'} alt='' className='product-img' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' />
              <p className='product-name'>White Nuts</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$15.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
            </div>
            <div className='product-box'>
              <div className='product-tag'>Vegetable</div>
              <Image src={'/assets/img/product4.webp'} alt='' className='product-img' layout='fill' sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px" objectFit='cover' objectPosition='center' />
              <p className='product-name'>Vegan Red Tomato</p>
              <div className='straight'></div>
              <div className='price-start-box'>
                <div className='price-box'>
                  <p className='price-old'>$20.00</p>
                  <p className='price-sale'>$17.00</p>
                </div>
                <div className='start-box'>
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
