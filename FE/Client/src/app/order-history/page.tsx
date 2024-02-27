import Image from 'next/image'
import React from 'react'
import './style.scss'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
type Props = {}

export default function OrderHistory({}: Props) {
  return (
    <div className='order-history'>
      <div className='container'>
        <div className='order-history-container'>
          <p className='order-history-title'>Order History</p>
          <div className='order-history-options'>
            <div className='option active'>All Orders</div>
            <div className='option'>Waiting for paid</div>
            <div className='option'>Complete</div>
          </div>
          <div className='search-box'>
            <input type='text' placeholder='Enter your id of order' />
            <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
            {/* <FontAwesomeIcon icon={faX} className='icon' /> */}
          </div>
          <ul className='list-orders'>
            <li className='order'>
              <div className='order-header-info'>
                <p className='order-id'>ID: 12331312312312312312312312 </p>
                <p className='order-date'> 24/02/2024</p>
                <p className='order-status'>Pending</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product2.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product3.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='order-more-info'>
                <div className='note'>
                  <p>
                    Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos debitis numquam alias
                    repellendus velit tempore nesciunt sint aspernatur ex nulla optio sed quaerat suscipit illo totam
                    beatae sit, quae ipsum!
                  </p>
                </div>
                <div className='total'>Total: $230.00</div>
              </div>
            </li>

            <li className='order'>
              <div className='order-header-info'>
                <p className='order-id'>ID: 12331312312312312312312312 </p>
                <p className='order-date'> 24/02/2024</p>
                <p className='order-status'>Pending</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product2.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product3.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='order-more-info'>
                <div className='note'>
                  <p>
                    Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos debitis numquam alias
                    repellendus velit tempore nesciunt sint aspernatur ex nulla optio sed quaerat suscipit illo totam
                    beatae sit, quae ipsum!
                  </p>
                </div>
                <div className='total'>Total: $230.00</div>
              </div>
            </li>

            <li className='order'>
              <div className='order-header-info'>
                <p className='order-id'>ID: 12331312312312312312312312 </p>
                <p className='order-date'> 24/02/2024</p>
                <p className='order-status'>Pending</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product2.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product3.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='order-more-info'>
                <div className='note'>
                  <p>
                    Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos debitis numquam alias
                    repellendus velit tempore nesciunt sint aspernatur ex nulla optio sed quaerat suscipit illo totam
                    beatae sit, quae ipsum!
                  </p>
                </div>
                <div className='total'>Total: $230.00</div>
              </div>
            </li>

            <li className='order'>
              <div className='order-header-info'>
                <p className='order-id'>ID: 12331312312312312312312312 </p>
                <p className='order-date'> 24/02/2024</p>
                <p className='order-status'>Pending</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product1.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product2.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='product-info'>
                <Image src={'/assets/img/product3.png'} alt='' width={100} height={100} />
                <div className='product-straight'>
                  <p className='product-name'>Calabrese Broccoli</p>
                  <p className='product-quantity'>x2</p>
                </div>
                <p className='product-price'>$13.00</p>
              </div>
              <div className='order-more-info'>
                <div className='note'>
                  <p>
                    Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos debitis numquam alias
                    repellendus velit tempore nesciunt sint aspernatur ex nulla optio sed quaerat suscipit illo totam
                    beatae sit, quae ipsum!
                  </p>
                </div>
                <div className='total'>Total: $230.00</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
