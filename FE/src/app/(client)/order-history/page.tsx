'use client'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import './style.scss'
import { useEffect, useState } from 'react'
import { products } from '@/app/components/detailShop/mockDataProducts'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSession } from 'next-auth/react'
import useFetch from '@/app/utils/useFetch'
import { useGetOrdersOfUserQuery } from '@/app/utils/hooks/ordersHooks'
import ErrorFetchingProduct from '@/app/components/errorFetchingProduct/indext'
import LoadingCustom from '@/app/components/loading'
import moment from 'moment'
type Props = {}

export default function OrderHistory({}: Props) {
  const fetchApi = useFetch()
  const { data: session } = useSession()
  const {
    data: ordersByUser,
    isLoading,
    isError,
  } = useGetOrdersOfUserQuery(fetchApi, session?.user._id)
  const [ordersDefaultShow, setOrdersDefaultShow] = useState(8)
  const [items, setItems] = useState(ordersByUser || [])
  const fetchMoreData = () => {
    setOrdersDefaultShow(prev => prev + 8)
    setItems((prev: any) => [...prev, ...ordersByUser])
  }
  useEffect(() => {
    if (ordersByUser) {
      ordersByUser.forEach((order: any) => {
        for (let i = 0; i < order.listProducts.length; i++) {
          const product = order.listDetailProducts.find(
            (item: any) => item._id === order.listProducts[i]._id
          )
          if (product) product.quantityAddCart = order.listProducts[i].quantityAddCart
        }
      })
      console.log(ordersByUser)
      setItems(ordersByUser)
    }
  }, [ordersByUser])
  if (isLoading) return <LoadingCustom />
  return (
    <div className='order-history'>
      <div className='container'>
        <div className='order-history-container'>
          <p className='order-history-title'>Order History</p>
          <div className='order-history-options'>
            <div className='option active'>All Orders</div>
            <div className='option'>Pending</div>
            <div className='option'>Cancel</div>
            <div className='option'>Completed</div>
          </div>
          <div className='search-box'>
            <input type='text' placeholder='Enter your id of order' />
            <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
            {/* <FontAwesomeIcon icon={faX} className='icon' /> */}
          </div>
          <ul className='list-orders'>
            <InfiniteScroll
              dataLength={ordersDefaultShow}
              next={fetchMoreData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              {items.map((order: any) => (
                <li className='order' key={order._id}>
                  <div className='order-header-info'>
                    <p className='order-id'>
                      ID: <span>{order._id}</span>
                    </p>
                    <p className='order-date'>
                      - {moment(order.createdAt).format('MM-DD-YYYY')}
                    </p>
                    <p className='order-status'>{order.status}</p>
                  </div>
                  {order.listDetailProducts.map((product: any) => (
                    <div className='product-info' key={product._id}>
                      <Image src={product.image} alt='' width={100} height={100} />
                      <div className='product-straight'>
                        <p className='product-name'>{product.name}</p>
                        <p className='product-quantity'>x{product.quantityAddCart}</p>
                      </div>
                      <p className='product-price'>${product.price}</p>
                    </div>
                  ))}
                  <div className='order-more-info'>
                    <div className='box-address'>
                      <div className='address'>
                        <p>
                          <span>Address:</span> {order.address}
                        </p>
                      </div>
                      <div className='phone'>
                        <p>
                          <span>Phone:</span> {order.phone}
                        </p>
                      </div>
                      <div className='note'>
                        <p>
                          <span>Note:</span> {order.note ? order.note : 'No note'}
                        </p>
                      </div>
                    </div>

                    <div className='total'>Total: ${order.totalPrice}</div>
                  </div>
                  <div className='action-for-order'>
                    {order.isPaid ? null : <button className='btn-checkout'>Checkout</button>}
                    {order.status === 'Complete' ? null : (
                      <button className='btn-cancel'>Cancel Order</button>
                    )}
                  </div>
                </li>
              ))}
            </InfiniteScroll>
          </ul>
        </div>
      </div>
    </div>
  )
}
