'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import './style.scss'
import LoadingCustom from '@/app/components/loading'
type Props = {}

export default function Success({}: Props) {
  const route = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrderSuccess] = useState<any>()
  useEffect(() => {
    const session_id = searchParams.get('session_id')
    const fetchData = async () => {
      const res = await fetch(`/api/sessions/${session_id}`, {
        method: 'GET',
      })
      const result = await res.json()
      setOrderSuccess(result.session)
      setIsLoading(false)
    }
    if (session_id) {
      fetchData()
    } else {
      route.push('/')
    }
  }, [searchParams, route])

  return (
    <div className='success-page'>
      {isLoading ? (
        <LoadingCustom />
      ) : (
        <div className='container'>
          <div className='success-container'>
            <p className='success-title'>Payment successfully</p>
            <h2 className='success-thank'>Thanks for ordering</h2>
            <p className='text'>
              We appreciate your order, we're currently preparing it.So hang tight and we'll send
              you confirmation very soon!
            </p>

            <div className='order-info'>
              <p className='order-number'>Order number:</p>
              <p className='oder-id'>{order.payment_intent}</p>
            </div>
            <div className='box-order'>
              <ul className='list-item'>
                {order?.line_items?.data?.map((item: any) => {
                  const { product } = item.price
                  return (
                    <li className='item' key={item.id}>
                      <div className='item-img'>
                        <Image
                          src={product.images[0]}
                          alt=''
                          className='item-img__img'
                          fill
                          sizes='100vw'
                        />
                      </div>
                      <div className='item-info'>
                        <p className='item-name'>{product.name}</p>
                        <div className='item-sub-box'>
                          <p className='item-quantity'>
                            Quantity: <span>{item.quantity}</span>
                          </p>
                          <p className='item-price'>
                            Price: <span>${item.price.unit_amount / 100}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className='info-checkout'>
              <div className='address-box'>
                <p className='address'>
                  Address: <span>{order.custom_fields[1].text.value}</span>
                </p>
                <p className='phone'>
                  Phone: <span>{order.custom_fields[0].numeric.value}</span>
                </p>
                {order.custom_fields[2].text.value && (
                  <p className='address'>
                    Note: <span>{order.custom_fields[2].text.value}</span>
                  </p>
                )}
              </div>
              <div className='price-box'>
                <p className='sub-total'>
                  Subtotal <span>${order.amount_subtotal / 100}</span>
                </p>
                <p className='tax'>
                  Tax <span>$0.00</span>
                </p>
                <p className='total'>
                  Total <span>${order.amount_total / 100}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
