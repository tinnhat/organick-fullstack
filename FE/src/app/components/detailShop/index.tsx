'use client'
import { useGetProductsQuery } from '@/app/utils/hooks/productsHooks'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import {
  faArrowDown,
  faArrowUp,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@mui/material/Rating'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'
import LoadingCustom from '../loading'
import { products } from './mockDataProducts'
import './style.scss'
import ErrorFetchingProduct from '../errorFetchingProduct/indext'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import client from '@/app/client'
import { cloneDeep, set } from 'lodash'
import { useDebounce } from '@uidotdev/usehooks'

type Props = {}

export default function DetailShop({}: Props) {
  const [page, setPage] = useState(1)
  const [quantityDefaultShow, setQuantityDefaultShow] = useState(16)
  const { data: allProducts, isLoading, isError } = useGetProductsQuery(page, quantityDefaultShow)
  const { data: allCategories } = useGetCategoriesQuery()
  const router = useRouter()
  const [showLoadingMore, setShowLoadingMore] = useState(true)
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Product[]>([])
  const [star, setStar] = React.useState<number | null>(0)
  const [filter, setFilter] = useState<any>({
    rating: 0,
    category: [],
  })
  const [showFilter, setShowFilter] = useState(true)

  const newConcatProduct = useCallback(async (page: number, pageSize: number) => {
    const res = await fetch(`http://localhost:8017/v1/products/?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    })
    const result = await res.json()
    return result.data
  }, [])
  const fetchMoreData = async () => {
    if (!showLoadingMore) return
    setQuantityDefaultShow(prev => prev + 16)
    setPage(prev => prev + 1)
    const result = await newConcatProduct(page + 1, quantityDefaultShow)
    if (result.length > 0) {
      //sort
      const newItems = cloneDeep([...items, ...result])
      let itemSet = newItems
      if (filter.rating) {
        itemSet = newItems.filter((item: any) => item.star === filter.rating)
      }
      if (filter.category.length > 0) {
        itemSet.filter((item: any) => filter.category.includes(item.categoryId))
      }
      if (search) {
        itemSet = itemSet.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      setItems(itemSet)
      setShowLoadingMore(false)
    }
  }
  useEffect(() => {
    setItems(allProducts)
  }, [allProducts])

  useEffect(() => {
    if (!allCategories) return
    setCategories(allCategories.map((item: Category) => ({ value: item._id, label: item.name })))
  }, [allCategories])

  useEffect(() => {
    const newItems = cloneDeep(allProducts)
    if (filter.rating) {
      //call api filter product by rating
    }
    if (filter.category.length > 0) {
      //call api filter product by category
    }
  }, [filter])

  if (isLoading) {
    return <LoadingCustom />
  }

  if (isError) {
    return <ErrorFetchingProduct />
  }

  const handleSortDesc = () => {
    setItems(prev => items.sort((a: any, b: any) => b.price - a.price))
    setShowFilter(true)
  }
  const handleSortAsc = () => {
    setItems(prev => items.sort((a: any, b: any) => a.price - b.price))
    setShowFilter(false)
  }

  const handleSearch = () => {
    //call api search by name
  }

  const handleChangCategory = (e: any) => {
    setFilter({
      ...filter,
      category: e.map((item: any) => item.value),
    })
  }

  const handleClearFilter = () => {
    setFilter({
      rating: 0,
      category: [],
      search: '',
    })
    setPage(1)
    setStar(0)
    setSearch('')
    setShowLoadingMore(true)
    setItems(allProducts)
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
                    setFilter((prev: any) => ({
                      ...prev,
                      rating: newValue,
                    }))
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
                onChange={handleChangCategory}
              />
            </div>
            <div className='search-box'>
              <input
                type='text'
                placeholder='Search'
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                }}
              />
              <FontAwesomeIcon
                style={{ cursor: 'pointer' }}
                icon={faMagnifyingGlass}
                className='icon'
                onClick={handleSearch}
              />
              <FontAwesomeIcon
                className='icon-clear'
                style={{ cursor: 'pointer' }}
                icon={faFilterCircleXmark}
                onClick={handleClearFilter}
              />
            </div>
          </div>
          <div className='container-products'>
            <InfiniteScroll
              dataLength={quantityDefaultShow}
              next={fetchMoreData}
              hasMore={true}
              loader={showLoadingMore && <h4>Loading...</h4>}
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
