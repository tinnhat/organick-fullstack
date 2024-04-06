'use client'

import LoadingCustom from '@/app/components/loading'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import './style.scss'


export default function Cancel() {
  const route = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrderCancel] = useState<any>()
  useEffect(() => {
    const session_id = searchParams.get('session_id')
    const fetchData = async () => {
      const res = await fetch(`/api/sessions/${session_id}`, {
        method: 'GET',
      })
      const result = await res.json()
      setOrderCancel(result.session)
      setIsLoading(false)
    }
    if (session_id) {
      fetchData()
    } else {
      route.push('/')
    }
  }, [searchParams, route])

  return (
    <div className='cancel-page'>
      {isLoading ? (
        <LoadingCustom />
      ) : (
        <div className='container'>
          <div className='cancel-container'>
            <p className='cancel-title'>Payment Information</p>
            <h2 className='cancel-thank'>Your order is pending</h2>
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
