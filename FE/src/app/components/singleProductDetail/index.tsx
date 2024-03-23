'use client'
import { useGetProductByIdQuery } from '@/app/utils/hooks/productsHooks'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import LoadingCustom from '../loading'
import './style.scss'
import { useQueryClient } from '@tanstack/react-query'
import client from '@/app/client'
import ErrorFetchingProduct from '../errorFetchingProduct/indext'
import RelatedProduct from '../relatedProduct'
import { cloneDeep } from 'lodash'
type Props = {
  params: any
}

export default function SingleProductDetail({ params }: Props) {
  const productRef = useRef<any>(null)
  const { data: product, isLoading, isError } = useGetProductByIdQuery(params.id)
  const [isAdding, setIsAdding] = useState(false)
  const handleAddtoCart = () => {
    if (productRef.current) {
      if (productRef.current.value === 0) return
      if (productRef.current.value > product.quantity) {
        toast.error('Quantity in stock is not enough', {
          position: 'bottom-right',
          duration: 3000,
        })
        return
      }
      client.setQueryData(['User Cart'], (initalValue: any) => {
        const updatedValue = Array.isArray(initalValue)
          ? [
              ...initalValue,
              {
                ...product,
                quantityAddCart: +productRef.current!.value,
              },
            ]
          : [
              {
                ...product,
                quantityAddCart: +productRef.current!.value,
              },
            ]
        const arrValue = cloneDeep(updatedValue).reduce((acc: any, item: any) => {
          const existingItem = acc.find((i: any) => i._id === item._id)
          if (existingItem) {
            existingItem.quantityAddCart += item.quantityAddCart
          } else {
            acc.push(item)
          }
          return acc
        }, [])
        return arrValue
      })
      productRef.current.value = 0
      toast.success('Added to cart', {
        position: 'bottom-right',
        duration: 3000,
      })
      setIsAdding(true)
      setTimeout(() => {
        setIsAdding(false)
      }, 3500)
    }
  }
  if (isLoading) return <LoadingCustom />
  if (isError) return <ErrorFetchingProduct />
  return (
    <>
      <section className='single-product'>
        <div className='container'>
          <div className='product-container'>
            <div className='img-box-product'>
              <Image src={product.image} alt='' className='img-box-product__img' layout='fill' />
              {product.quantity === 0 && <div className='product-sold-out'>Sold out</div>}
            </div>
            <div className='product-info'>
              <p className='product-name'>{product.name}</p>
              <div className='rating-box'>
                {new Array(product.star).map((item, index: number) => (
                  <FontAwesomeIcon key={index} icon={faStar} />
                ))}
              </div>
              <p className='product-price'>
                {product.sale && <span>${product.sale}</span>}${product.price}
              </p>
              <p className='product-quantity'>
                Quantity: <span>{product.quantity}</span> - Product in stock
              </p>
              <p className='product-info-text'>{product.description}</p>
              <p className='product-category'>{product.category[0]?.name}</p>
              <div className='box-quantity'>
                <p>Quantity: </p>
                <input
                  disabled={product.quantity === 0 || isAdding}
                  ref={productRef}
                  min={1}
                  max={999}
                  type='number'
                  defaultValue={1}
                />
                {product.quantity === 0 ? (
                  <button disabled={isAdding} className='btn btn-add-cart sold-out'>
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled={isAdding}
                    className='btn btn-add-cart'
                    onClick={handleAddtoCart}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className='product-detail'>
            <p className='product-desc'>Product Description</p>
            <p className='product-addition'>Additional Info</p>
          </div>
          <p className='detail'>
            Welcome to the world of natural and organic. Here you can discover the bounty of nature.
            We have grown on the principles of health, ecology, and care. We aim to give our
            customers a healthy chemical-free meal for perfect nutrition. It offers about 8–10%
            carbs. Simple sugars — such as glucose and fructose — make up 70% and 80% of the carbs
            in raw.
          </p>
        </div>
      </section>
      <RelatedProduct />
    </>
  )
}
