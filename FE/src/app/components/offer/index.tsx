'use client'
import React from 'react'
import './style.scss'
import Image from 'next/image'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/navigation'
import { useGetProductsOfferQuery, useGetProductsQuery } from '@/app/utils/hooks/productsHooks'
type Props = {}

export default function Offer({}: Props) {
  const router = useRouter()
  const { data: allProducts, isLoading, isError } = useGetProductsOfferQuery(3, 4)
  return (
    <section className='offer'>
      <div className='container'>
        <div className='offer-container'>
          <div className='header-offer-box'>
            <div className='left'>
              <p className='left-title'>Offer</p>
              <p className='left-text'>We Offer Organic For You</p>
            </div>
            <button className='btn btn-offer' onClick={() => router.push('/shop')}>
              View All Product
              <span>
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
          </div>
          <div className='row-products' data-aos='fade-up' data-aos-duration='500'>
            {allProducts &&
              allProducts.map((product: Product, index: number) => (
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
      </div>
    </section>
  )
}
