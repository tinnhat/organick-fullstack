'use client'
import { Box, Typography } from '@mui/material'
import client from '@/app/client'
import { useGetProductByIdQuery } from '@/app/utils/hooks/productsHooks'
import { useGetReviewsByProductIdQuery, useAddReviewMutation, useEditReviewMutation, useDeleteReviewMutation } from '@/app/utils/hooks/reviewsHooks'
import useFetch from '@/app/utils/useFetch'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cloneDeep } from 'lodash'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import ErrorFetchingProduct from '../errorFetchingProduct/index'
import LoadingCustom from '../loading'
import RelatedProduct from '../relatedProduct'
import { ReviewForm, ReviewList } from '@/components/review'
import './style.scss'
type Props = {
  params: any
}

export default function SingleProductDetail({ params }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const productRef = useRef<any>(null)
  const fetchApi = useFetch()
  const { data: product, isLoading, isError } = useGetProductByIdQuery(params.id)
  const { data: reviews } = useGetReviewsByProductIdQuery(params.id)
  const [isAdding, setIsAdding] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)

  const addReviewMutation = useAddReviewMutation(fetchApi)
  const editReviewMutation = useEditReviewMutation(fetchApi, editingReview?._id || '')
  const deleteReviewMutation = useDeleteReviewMutation(fetchApi)

  const handleAddtoCart = () => {
    if (!session) {
      toast.error('Please login first', {
        position: 'bottom-right',
        duration: 3000,
      })
      router.push('/login')
      return
    }
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
                quantityAddtoCart: +productRef.current!.value,
              },
            ]
          : [
              {
                ...product,
                quantityAddtoCart: +productRef.current!.value,
              },
            ]
        const arrValue = cloneDeep(updatedValue).reduce((acc: any, item: any) => {
          const existingItem = acc.find((i: any) => i._id === item._id)
          if (existingItem) {
            existingItem.quantityAddtoCart += item.quantityAddtoCart
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

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    if (!session) {
      toast.error('Please login first', { position: 'bottom-right' })
      router.push('/login')
      return
    }
    if (editingReview) {
      await editReviewMutation.mutateAsync(data)
      setEditingReview(null)
    } else {
      await addReviewMutation.mutateAsync({ productId: params.id, ...data })
    }
  }

  const handleReviewEdit = (review: any) => {
    setEditingReview(review)
  }

  const handleReviewDelete = async (reviewId: string) => {
    await deleteReviewMutation.mutateAsync(reviewId)
  }

  const reviewsList = reviews || []
  const averageRating = reviewsList.length > 0
    ? reviewsList.reduce((acc: number, r: Review) => acc + r.rating, 0) / reviewsList.length
    : product?.star || 0

  if (isLoading) return <LoadingCustom />
  if (isError) return <ErrorFetchingProduct />
  return (
    <>
      <section className='single-product'>
        <div className='container'>
          <div className='product-container'>
            <div className='img-box-product'>
              <Image
                src={product.image}
                alt=''
                className='img-box-product__img'
                layout='fill'
                sizes='(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw, 800px'
                objectFit='cover'
                objectPosition='center'
                priority
              />
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
                  step={1}
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

          {/* ============ FEATURE: shop-ui START ============ */}
          <Box sx={{ mt: 6 }}>
            <Typography variant='h5' sx={{ mb: 3, fontWeight: 600, color: '#274c5b' }}>
              Customer Reviews
            </Typography>
            <ReviewForm
              productId={params.id}
              existingReview={editingReview}
              onSubmit={handleReviewSubmit}
              onCancel={editingReview ? () => setEditingReview(null) : undefined}
            />
            <Box sx={{ mt: 4 }}>
              <ReviewList
                reviews={reviewsList}
                averageRating={averageRating}
                totalReviews={reviewsList.length}
                currentUserId={session?.user?._id}
                onEdit={handleReviewEdit}
                onDelete={handleReviewDelete}
              />
            </Box>
          </Box>
          {/* ============ FEATURE: shop-ui END ============ */}
        </div>
      </section>
      <RelatedProduct />
    </>
  )
}
