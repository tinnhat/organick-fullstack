'use client'
import Image from 'next/image'
import React from 'react'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

type Props = {}

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: '123', label: 'Vanilzzz  9la' },
  { value: '123ww', label: 'Vanzzzilla' },
  { value: 'www', label: 'aa' },
]

export default function DetailShop({}: Props) {
  return (
    <section className='detail-shop'>
      <div className='container'>
        <h1 className='title'>Shop</h1>
        <div className='shop-container'>
          <div className='container-filter'>
            <div className='filter-box'>
              {/* sort by price - asc or desc */}
              {/* <button className='btn-price'>Price - ASC <FontAwesomeIcon icon={faArrowUp} /></button> */}
              <button className='btn-price'>Price - DESC <FontAwesomeIcon icon={faArrowDown} /></button>
              {/* sort by rating - click to show 0 -> 5 start */}
              <div  className='rating-box'>
                <span>Rating:</span>
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              {/* sort by category - select option */}
              <Select
                defaultValue={[options[1], options[2]]}
                isMulti
                name='colors'
                options={options}
                className='basic-multi-select'
                classNamePrefix='select'
                placeholder='Choose category'
              />
            </div>
            <div className='search-box'>
              <input type='text' />
              <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
            </div>
          </div>
          <div className='container-products'>
            <div className='row-products'>
              <div className='product-box'>
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <div className='product-tag'>Vegetable</div>
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
                <p className='product-name'>Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli</p>
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
                <Image
                  src={'/assets/img/product2.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product3.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product4.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product5.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product6.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product7.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product8.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />
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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
                <Image
                  src={'/assets/img/product1.png'}
                  alt=''
                  className='product-img'
                  layout='fill'
                />

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
