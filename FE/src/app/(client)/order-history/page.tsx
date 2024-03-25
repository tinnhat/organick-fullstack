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
import { useRouter } from 'next/navigation'
import { useGetOrdersOfUserQuery } from '@/app/utils/hooks/ordersHooks'
import ErrorFetchingProduct from '@/app/components/errorFetchingProduct/indext'
import LoadingCustom from '@/app/components/loading'
import moment from 'moment'
import { useDebounce } from '@uidotdev/usehooks'
import { cloneDeep } from 'lodash'
type Props = {}

export default function OrderHistory({}: Props) {
  const router = useRouter()
  const fetchApi = useFetch()
  const { data: session } = useSession()
  const {
    data: ordersByUser,
    isLoading,
    isError,
  } = useGetOrdersOfUserQuery(fetchApi, session?.user._id)
  const [ordersDefaultShow, setOrdersDefaultShow] = useState(12)
  const [items, setItems] = useState(ordersByUser || [])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [status, setStatus] = useState([
    {
      text: 'All',
      active: true,
    },
    {
      text: 'Pending',
      active: false,
    },
    {
      text: 'Cancel',
      active: false,
    },
    {
      text: 'Complete',
      active: false,
    },
  ])
  const fetchMoreData = () => {
    setOrdersDefaultShow(prev => prev + 12)
    //call api get more product
    // setItems((prev: any) => [...prev, ...ordersByUser])
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
      setItems(ordersByUser)
    }
  }, [ordersByUser])

  useEffect(() => {
    const newOrderShow = cloneDeep(items)
    if (debouncedSearch) {
      const filtered = newOrderShow.filter((item: User) => {
        return item._id.includes(search)
      })
      console.log(filtered)
      // setItems(filtered)
    }
  }, [debouncedSearch, items, search])

  const handleChangeFilter = (item: any) => {
    if (item.text === 'All') {
      setItems(ordersByUser)
    } else {
      const ordersFilter = ordersByUser?.filter((order: any) => {
        return order.status === item.text
      })
      setItems(ordersFilter)
    }
    setStatus((prev: any) => {
      return prev.map((val: any) => {
        if (val.text === item.text) {
          val.active = true
        } else {
          val.active = false
        }
        return val
      })
    })
  }
  if (isLoading) return <LoadingCustom />
  return (
    <div className='order-history'>
      <div className='container'>
        <div className='order-history-container'>
          <p className='order-history-title'>Order History</p>
          <div className='order-history-options'>
            {status.map((item, index) => {
              return (
                <div
                  className={`option ${item.active ? 'active' : ''}`}
                  onClick={() => handleChangeFilter(item)}
                  key={index}
                >
                  {item.text}
                </div>
              )
            })}
          </div>
          <div className='search-box'>
            <input
              type='text'
              placeholder='Enter your id of order'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
            {/* <FontAwesomeIcon icon={faX} className='icon' /> */}
          </div>
          <ul className='list-orders'>
            {items.length > 0 ? (
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
                      <p className='order-date'>- {moment(order.createdAt).format('MM-DD-YYYY')}</p>
                      <p className={`order-status ${order.status}`}>{order.status}</p>
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
                      {order.isPaid ? null : (
                        <button
                          className='btn-checkout'
                          onClick={() => router.push(order.stripeCheckoutLink)}
                        >
                          Checkout
                        </button>
                      )}
                      {order.status === 'Complete' ? null : (
                        <button className='btn-cancel'>Cancel Order</button>
                      )}
                    </div>
                  </li>
                ))}
              </InfiniteScroll>
            ) : (
              <p className='no-order'>No order</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
