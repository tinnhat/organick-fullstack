'use client'
import LoadingCustom from '@/app/components/loading'
import {
  useCancelOrderMutation,
  useGetAllOrdersOfUserQuery,
  useGetOrderDetailQuery,
  useGetOrdersOfUserQuery,
} from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
import { faChevronLeft, faChevronRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebounce } from '@uidotdev/usehooks'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import './style.scss'
import ReactPaginate from 'react-paginate'
import { toast } from 'sonner'
type Props = {}

export default function OrderHistory({}: Props) {
  const router = useRouter()
  const fetchApi = useFetch()
  const [page, setPage] = useState(1)
  const [ordersDefaultShow, setOrdersDefaultShow] = useState(10)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pageCount, setPageCount] = useState(0)
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
  const { data: session } = useSession()
  const {
    data: ordersByUser,
    isLoading,
    isError,
    refetch: refetchOrdersByUser,
  } = useGetOrdersOfUserQuery(fetchApi, session?.user._id, page, ordersDefaultShow)
  const {
    data: allOrdersByUser,
    isLoading: isLoadingAllOrders,
    refetch: refetchAllOrders,
  } = useGetAllOrdersOfUserQuery(fetchApi, session?.user._id)
  const { mutateAsync: cancelOrder } = useCancelOrderMutation(fetchApi)
  const [items, setItems] = useState(ordersByUser || [])

  const newConcatOrder = useCallback(
    async (page: number, ordersDefaultShow: number) => {
      const res = await fetchApi(
        `/orders/user/${session?.user._id}/?page=${page}&pageSize=${ordersDefaultShow}`,
        {
          method: 'GET',
        }
      )
      return res.data.data
    },
    [fetchApi, session?.user._id]
  )
  useEffect(() => {
    if (ordersByUser) {
      ordersByUser.forEach((order: any) => {
        for (let i = 0; i < order.listProducts.length; i++) {
          const product = order.listDetailProducts.find(
            (item: any) => item._id === order.listProducts[i]._id
          )
          if (product) product.quantityAddtoCart = order.listProducts[i].quantityAddtoCart
        }
      })
      setItems(ordersByUser)
    }
  }, [ordersByUser])

  useEffect(() => {
    if (allOrdersByUser) {
      setPageCount(Math.ceil(allOrdersByUser.length / ordersDefaultShow))
    }
  }, [allOrdersByUser])

  const handleChangeFilter = (item: any) => {
    if (item.text === 'All') {
      setItems(ordersByUser)
      setPageCount(Math.ceil(allOrdersByUser.length / ordersDefaultShow))
    } else {
      const ordersFilter = ordersByUser?.filter((order: any) => {
        return order.status === item.text
      })
      setItems(ordersFilter)
      setPageCount(Math.ceil(ordersFilter.length / ordersDefaultShow))
    }
    setPage(1)
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

  const handlePageClick = async ({ selected }: any) => {
    window.scrollTo(0, 0)
    //bấm next thì call api get products page tiep theo
    setPage(selected)
    setLoading(true)
    const result = await newConcatOrder(selected + 1, ordersDefaultShow)
    setItems(result)
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!search) return
    const result = await fetchApi(`/orders/${search}`, {
      method: 'GET',
    })
    if (result.data.hasOwnProperty('message')) {
      toast.error('Not found', { position: 'bottom-right' })
      return
    }
    setPage(1)
    setPageCount(0)
    setItems([
      {
        ...result.data.data,
        listDetailProducts: result.data.data.listProductsDetail,
      },
    ])
    setStatus((prev: any) => {
      return prev.map((val: any) => {
        val.active = false
        return val
      })
    })
    setSearch('')
  }

  const handleCancelOrder = async (_id: string) => {
    const result = await cancelOrder(_id)
    if (!result) return
    refetchOrdersByUser()
    refetchAllOrders()
    toast.success('Cancel order successfully', { position: 'bottom-right' })
  }

  if (isLoading && isLoadingAllOrders) return <LoadingCustom />
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
            <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' onClick={handleSearch} />
            {/* <FontAwesomeIcon icon={faX} className='icon' /> */}
          </div>

          <ul className='list-orders'>
            {items.length > 0 ? (
              items.map((order: any) => (
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
                        <p className='product-quantity'>x{product.quantityAddtoCart}</p>
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
                    {order.isPaid ||
                    order.status === 'Complete' ||
                    order.status === 'Cancel' ? null : (
                      <button
                        className='btn-checkout'
                        onClick={() => router.push(order.stripeCheckoutLink)}
                      >
                        Checkout
                      </button>
                    )}
                    {order.status === 'Complete' || order.status === 'Cancel' ? null : (
                      <button className='btn-cancel' onClick={() => handleCancelOrder(order._id)}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p className='no-order'>No order</p>
            )}
          </ul>
        </div>
        <div className='container-pagination'>
          <ReactPaginate
            activeClassName={'page-btn active'}
            breakClassName={'page-btn break-me '}
            breakLabel={'...'}
            containerClassName={'pagination'}
            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
            disabledClassName={'disabled-page'}
            nextClassName={'page-btn next '}
            pageClassName={'page-btn pagination-page '}
            previousClassName={'page-btn previous'}
            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
            pageCount={pageCount || 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            forcePage={0}
          />
        </div>
      </div>
    </div>
  )
}
