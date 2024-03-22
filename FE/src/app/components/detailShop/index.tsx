'use client'
import { useGetProductsQuery } from '@/app/utils/hooks/productsHooks'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faArrowDown, faArrowUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
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
import ErrorFetchingProduct from '../errorFetchingProduct/indext'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'

type Props = {}

export default function DetailShop({}: Props) {
  const { data: allProducts, isLoading, isError } = useGetProductsQuery()
  const { data: allCategories } = useGetCategoriesQuery()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [optionCategory, setOptionCategory] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [quantityDefaultShow, setQuantityDefaultShow] = useState(4)
  const [items, setItems] = useState<Product[]>([])
  const [star, setStar] = React.useState<number | null>(0)
  const [showFilter, setShowFilter] = useState(true)
  const fetchMoreData = () => {
    setQuantityDefaultShow(prev => prev + 4)
    setItems((prev: any) => [...prev, ...allProducts])
  }
  useEffect(() => {
    setItems(allProducts)
  }, [allProducts])

  useEffect(() => {
    if (!allCategories) return
    setCategories(allCategories.map((item: Category) => ({ value: item._id, label: item.name })))
  }, [allCategories])

  useEffect(() => {
    if (!optionCategory) return
    // setItems(allProducts.filter((product: any) => product.categoryId === optionCategory.value))
    // const newItems = allProducts.filter((product: any) =>
    //   optionCategory.some((category: any) => category.value === product.categoryId)
    // )
    // setItems(newItems)
  }, [optionCategory])

  if (isLoading) {
    return <LoadingCustom />
  }

  if (isError) {
    return <ErrorFetchingProduct />
  }

  const handleSortDesc = () => {
    setItems(allProducts.sort((a: any, b: any) => b.price - a.price))
    setShowFilter(true)
  }
  const handleSortAsc = () => {
    setItems(allProducts.sort((a: any, b: any) => a.price - b.price))
    setShowFilter(false)
  }

  const handleSearch = () => {
    console.log(search)
    
  }

  return (
    <section className='detail-shop'>
      <div className='container'>
        <h1 className='title'>Shop</h1>
        <div className='shop-container'>
          <div className='container-filter'>
            <div className='filter-box'>
              {/* sort by price - asc or desc */}
              {showFilter ? (
                <button className='btn-price' onClick={handleSortAsc}>
                  Price - ASC <FontAwesomeIcon icon={faArrowUp} />
                </button>
              ) : (
                <button className='btn-price' onClick={handleSortDesc}>
                  Price - DESC <FontAwesomeIcon icon={faArrowDown} />
                </button>
              )}
              {/* sort by rating - click to show 0 -> 5 start */}
              <div className='rating-box'>
                <span>Rating:</span>
                <Rating
                  name='simple-controlled'
                  value={star}
                  onChange={(event, newValue) => {
                    setStar(newValue)
                    setItems(allProducts.filter((product: any) => product.star === newValue))
                  }}
                />
              </div>
              {/* sort by category - select option */}
              <Select
                isMulti
                name='colors'
                options={categories}
                className='basic-multi-select'
                classNamePrefix='select'
                placeholder='Choose category'
                onChange={choice => setOptionCategory(choice)}
              />
            </div>
            <div className='search-box'>
              <input
                type='text'
                placeholder='Search'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <FontAwesomeIcon
                style={{ cursor: 'pointer' }}
                icon={faMagnifyingGlass}
                className='icon'
                onClick={handleSearch}
              />
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
                      onClick={() => router.push(`/shop/${product.slug}/${product._id}`)}
                    >
                      <div className='product-tag'>
                        {product.category && product.category[0]?.name}
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
