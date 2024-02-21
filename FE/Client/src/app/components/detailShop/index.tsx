import Image from 'next/image'
import React from 'react'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
type Props = {}

export default function DetailShop({}: Props) {
  return (
    <section className='detail-shop'>
      <div className='container'>
        <div className='shop-container'>
          <div className='container-products'>
            <div className='row-products'>
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
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
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
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
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
                <Image src={'/assets/img/product4.png'} alt='' className='product-img' layout='fill' />
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
              <div className='product-box'>
                <div className='product-tag'>Health</div>
                <Image src={'/assets/img/product5.png'} alt='' className='product-img' layout='fill' />
                <p className='product-name'>Mung Bean</p>
                <div className='straight'></div>
                <div className='price-start-box'>
                  <div className='price-box'>
                    <p className='price-old'>$20.00</p>
                    <p className='price-sale'>$11.00</p>
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
                <div className='product-tag'>Nuts</div>
                <Image src={'/assets/img/product6.png'} alt='' className='product-img' layout='fill' />
                <p className='product-name'>Brown Hazelnut</p>
                <div className='straight'></div>
                <div className='price-start-box'>
                  <div className='price-box'>
                    <p className='price-old'>$20.00</p>
                    <p className='price-sale'>$12.00</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product7.png'} alt='' className='product-img' layout='fill' />
                <p className='product-name'>Eggs</p>
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
              <div className='product-box'>
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product8.png'} alt='' className='product-img' layout='fill' />
                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
                <div className='product-tag'>Fresh</div>
                <Image src={'/assets/img/product1.png'} alt='' className='product-img' layout='fill' />

                <p className='product-name'>Zelco Suji Elaichi Rush</p>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
