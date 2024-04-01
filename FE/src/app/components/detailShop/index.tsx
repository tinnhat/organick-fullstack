'use client'
import { useGetAllProductsQuery, useGetProductsQuery } from '@/app/utils/hooks/productsHooks'
import { useGetCategoriesQuery } from '@/app/utils/hooks/useCategories'
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@mui/material/Rating'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import ErrorFetchingProduct from '../errorFetchingProduct/indext'
import LoadingCustom from '../loading'
import './style.scss'
import ReactPaginate from 'react-paginate'
import { DotLoader } from 'react-spinners'

type Props = {}

export default function DetailShop({}: Props) {
  const [page, setPage] = useState(1)
  const [quantityDefaultShow, setQuantityDefaultShow] = useState(16)
  const { data: allProducts, isLoading, isError } = useGetProductsQuery(page, quantityDefaultShow)
  const { data: allProductsNotPagination, isLoading: isLoadingNotPagination } =
    useGetAllProductsQuery()
  const { data: allCategories } = useGetCategoriesQuery()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Product[]>([])
  const [star, setStar] = React.useState<number | null>(0)
  const [categoriesFilter, setCategoriesFilter] = useState([])
  const [loading, setLoading] = useState(true)

  const [showFilter, setShowFilter] = useState(true)

  const newConcatProduct = useCallback(async (page: number, pageSize: number) => {
    const res = await fetch(
      `http://localhost:8017/v1/products/?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
      }
    )
    const result = await res.json()
    return result.data
  }, [])

  useEffect(() => {
    if (!allProducts) return
    setLoading(true)
    setItems(allProducts)
    setLoading(false)
  }, [allProducts])

  useEffect(() => {
    if (!allCategories) return
    setCategories(
      allCategories
        .filter((item: any) => !item._destroy)
        .map((item: Category) => ({ value: item._id, label: item.name }))
    )
  }, [allCategories])

  if (isLoading || isLoadingNotPagination) {
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
    setCategoriesFilter(e.map((item: any) => item.value))
  }

  const handleChangeRating = (e: any, newValue: any) => {
    setStar(newValue)
  }

  const handleClearFilter = () => {
    // setPage(1)
    // setStar(0)
    // setSearch('')
    // setQuantityDefaultShow(16)
    // setShowLoadingMore(true)
    setItems(allProducts)
  }

  const handlePageClick = async ({ selected }: any) => {
    //bấm next thì call api get products page tiep theo
    setPage(selected)
    setLoading(true)
    const result = await newConcatProduct(selected + 1, quantityDefaultShow)
    setItems(result)
    setLoading(false)
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
                <Rating name='simple-controlled' value={star} onChange={handleChangeRating} />
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
          {loading ? (
            <div className='loading-product'>
              <DotLoader size={50} color='#274c5b' />
            </div>
          ) : (
            <div className='container-products'>
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
            </div>
          )}

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
              pageCount={Math.ceil(allProductsNotPagination.length / quantityDefaultShow)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              initialPage={0}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
