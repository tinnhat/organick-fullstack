'use client'
import { useGetProductsQuery } from '@/app/utils/hooks/productsHooks'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faArrowDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@mui/material/Rating'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'
import LoadingCustom from '../loading'
import { products } from './mockDataProducts'
import './style.scss'

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
  const { data: allProducts, isLoading } = useGetProductsQuery()
  console.log(allProducts)
  const router = useRouter()
  const [quantityDefaultShow, setQuantityDefaultShow] = useState(8)
  const [items, setItems] = useState<Product[]>([])
  const [star, setStar] = React.useState<number | null>(2)
  const fetchMoreData = () => {
    setQuantityDefaultShow(prev => prev + 8)
    setItems((prev: any) => [...prev, ...allProducts])
  }
  useEffect(() => {
    setItems(allProducts)
  }, [allProducts])
  if (isLoading) {
    return <LoadingCustom />
  }
  return (
    <section className='detail-shop'>
      <div className='container'>
        <h1 className='title'>Shop</h1>
        <div className='shop-container'>
          <div className='container-filter'>
            <div className='filter-box'>
              {/* sort by price - asc or desc */}
              {/* <button className='btn-price'>Price - ASC <FontAwesomeIcon icon={faArrowUp} /></button> */}
              <button className='btn-price'>
                Price - DESC <FontAwesomeIcon icon={faArrowDown} />
              </button>
              {/* sort by rating - click to show 0 -> 5 start */}
              <div className='rating-box'>
                <span>Rating:</span>
                {/* <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} /> */}
                <Rating
                  name='simple-controlled'
                  value={star}
                  onChange={(event, newValue) => {
                    setStar(newValue)
                  }}
                />
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
            <InfiniteScroll
              dataLength={quantityDefaultShow}
              next={fetchMoreData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              <div className='row-products'>
                {items &&
                  items.map((product: Product, index: number) => (
                    <div
                      className={`product-box ${product.quantity === 0 ? 'product-sold-out' : ''}`}
                      key={index}
                      onClick={() => router.push(`/shop/${product._id}`)}
                    >
                      <div className='product-tag'>
                        {product.category && product.category[0].name}
                      </div>
                      {typeof product.image === 'string' || product.image instanceof Buffer ? (
                        <Image
                          src={product.image.toString()}
                          alt=''
                          className='product-img'
                          layout='fill'
                        />
                      ) : (
                        <div>No image available</div>
                      )}
                      <p className='product-name'>{product.name}</p>
                      <div className='straight'></div>
                      <div className='price-start-box'>
                        <div className='price-box'>
                          <p className='price-old'>${product.priceSale}</p>
                          <p className='price-sale'>${product.price}</p>
                        </div>
                        <div className='start-box'>
                          {Array.from({ length: product.star }).map((val, idx) => (
                            <FontAwesomeIcon icon={faStar} key={idx} />
                          ))}
                        </div>
                      </div>
                      {product.quantity === 0 && <div className='sold-out'>Sold out</div>}
                    </div>
                  ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
