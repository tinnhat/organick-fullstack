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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import ErrorFetchingProduct from '../errorFetchingProduct/indext'
import LoadingCustom from '../loading'
import CreatableSelect from 'react-select/creatable'
import './style.scss'
import ReactPaginate from 'react-paginate'
import { DotLoader } from 'react-spinners'
import { cloneDeep, sortBy } from 'lodash'
import { toast } from 'sonner'

type Props = {}

export default function DetailShop({}: Props) {
  const [pageNumber, setPageNumber] = useState(0)
  const [quantityDefaultShow, setQuantityDefaultShow] = useState(20)
  const { data: allProducts, isLoading, isError } = useGetAllProductsQuery()
  const { data: allCategories } = useGetCategoriesQuery()
  const [dataSearch, setDataSearch] = useState<Product[]>([])
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Product[]>([])
  const [star, setStar] = React.useState<number | null>(0)
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [showFilter, setShowFilter] = useState(true)
  const selectRef = useRef<any>()

  const handleClear = () => {
    selectRef.current!.clearValue()
  }
  useEffect(() => {
    if (allProducts) {
      setItems(allProducts)
      setLoading(false)
    }
  }, [allProducts])

  useEffect(() => {
    if (!allCategories) return
    setCategories(
      allCategories
        .filter((item: any) => !item._destroy)
        .map((item: Category) => ({ value: item._id, label: item.name }))
    )
  }, [allCategories])

  useEffect(() => {
    if (star === null && categoriesFilter.length === 0) return
    //check filter
    if (search) {
      let itemsSet = cloneDeep(dataSearch)
      if (star) {
        itemsSet = itemsSet.filter((item: Product) => item.star === star)
        setPageNumber(0)
        setItems(itemsSet)
      }
      if (categoriesFilter.length > 0) {
        const filteredData = itemsSet.filter((item: Product) =>
          categoriesFilter.includes(item.categoryId!)
        )
        setPageNumber(0)
        setItems(filteredData)
      }
    } else {
      let itemsSet = cloneDeep(allProducts)
      if (star) {
        itemsSet = itemsSet.filter((item: Product) => item.star === star)
        setPageNumber(0)
        setItems(itemsSet)
      }
      if (categoriesFilter.length > 0) {
        const filteredData = itemsSet.filter((item: Product) =>
          categoriesFilter.includes(item.categoryId!)
        )
        setPageNumber(0)
        setItems(filteredData)
      }
    }
  }, [star, categoriesFilter])

  if (isLoading) {
    return <LoadingCustom />
  }

  if (isError) {
    return <ErrorFetchingProduct />
  }

  const handleSortDesc = () => {
    setItems(prev => prev.sort((a, b) => b.price - a.price))
    setShowFilter(true)
  }
  const handleSortAsc = () => {
    setItems(prev => prev.sort((a, b) => a.price - b.price))
    setShowFilter(false)
  }
  const handleSearch = () => {
    //call api search by name
    ;(async () => {
      setLoading(true)
      const response = await fetch(`${process.env.HOST_BE}/products/search?name=${search}`)
      const data = await response.json()
      if (!data.data) {
        toast.error('Not found product', {
          position: 'bottom-right',
        })
        setLoading(false)
        return
      }
      //check xem dang co filter hay k
      let itemSet = cloneDeep(data.data)
      if (star) {
        itemSet = itemSet.filter((item: Product) => item.star === star)
        setItems(itemSet)
        setDataSearch(itemSet)
      } else if (categoriesFilter.length > 0) {
        const filteredData = itemSet.filter((item: Product) =>
          categoriesFilter.includes(item.categoryId!)
        )
        setItems(filteredData)
        setDataSearch(filteredData)
      } else {
        setItems(itemSet)
        setDataSearch(itemSet)
      }
      setLoading(false)
    })()
  }

  const handleChangCategory = (e: any) => {
    setCategoriesFilter(e.map((item: any) => item.value))
  }

  const handleChangeRating = (e: any, newValue: any) => {
    setStar(newValue)
  }

  const handleClearFilter = () => {
    setLoading(true)
    setPageNumber(0)
    setStar(0)
    setSearch('')
    handleClear()
    setCategoriesFilter([])
    setQuantityDefaultShow(20)
    setItems(allProducts)
    setLoading(false)
  }

  const productPerPage = 20
  const pagesVisited = pageNumber * productPerPage
  const productShow =
    items &&
    items
      .slice(pagesVisited, pagesVisited + productPerPage)
      .map((product: Product, index: number) => {
        return (
          <div
            className={`product-box ${product.quantity === 0 ? 'product-sold-out' : ''}`}
            key={index}
            onClick={() => router.push(`/shop/${product.slug}/${product._id}`)}
          >
            <div className='product-tag'>{product.category && product.category[0]?.name}</div>
            {typeof product.image === 'string' || product.image instanceof Buffer ? (
              <Image
                src={product.image.toString()}
                alt=''
                className='product-img'
                layout='fill'
                sizes='(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px'
                objectFit='cover'
                objectPosition='center'
              />
            ) : (
              <div>No image available</div>
            )}
            <p className='product-name'>{product.name}</p>
            <div className='straight'></div>
            <div className='price-start-box'>
              <div className='price-box'>
                {product.priceSale === 0 ? null : <p className='price-old'>${product.priceSale}</p>}
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
        )
      })
  const pageCount = items && Math.ceil(items.length / productPerPage)
  const changePage = ({ selected }: { selected: number }) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
    setPageNumber(selected)
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
                ref={selectRef}
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
              <div className='row-products'>{productShow}</div>
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
              pageCount={pageCount || 0}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={changePage}
              initialPage={0}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
