import client from '@/app/client'
import { useCreateOrderMutation } from '@/app/utils/hooks/ordersHooks'
import useFetch from '@/app/utils/useFetch'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep, isEmpty } from 'lodash'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import ApplyCoupon from '../coupon/ApplyCoupon'
import './style.scss'

type Props = {
  setShowCart: (value: boolean) => void
}

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ModalCart({ setShowCart }: Props) {
  const { data: session } = useSession()
  const fetchApi = useFetch()
  const { mutateAsync: createOrder } = useCreateOrderMutation(fetchApi)
  const path = usePathname()
  const [cart, setCart] = useState<any>()
  const router = useRouter()
  const { data: user } = useQuery<any>({ queryKey: ['User Cart'] })
  const [showRedirect, setShowRedirect] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    type: 'percentage' | 'fixed'
    value: number
    discount: number
  } | null>(null)

  useEffect(() => {
    if (!isEmpty(user)) {
      setCart(user)
    }
  }, [user])

  const totalAmount = useMemo(() => {
    if (!cart || cart.length === 0) return 0
    return cart.reduce((sum: number, item: any) => sum + item.price * item.quantityAddtoCart, 0)
  }, [cart])

  const finalAmount = useMemo(() => {
    if (!appliedCoupon) return totalAmount
    return Math.max(0, totalAmount - appliedCoupon.discount)
  }, [totalAmount, appliedCoupon])

  const handleApplyCoupon = (coupon: {
    code: string
    type: 'percentage' | 'fixed'
    value: number
    discount: number
  }) => {
    setAppliedCoupon(coupon)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleCheckout = async () => {
    setShowRedirect(true)
    //check quantity truoc
    const checkQuantity = await fetch(`${process.env.HOST_BE}/products/checkList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: cart.map((product: any) => {
          return {
            _id: product._id,
            quantityAddtoCart: product.quantityAddtoCart,
          }
        }),
      }),
    })
    const result = await checkQuantity.json()
    if (result.hasOwnProperty('message')) {
      toast.error(result.message, {
        position: 'top-center',
      })
      setShowRedirect(false)
      return
    }
    //neu du quantituy cho nguyen list product thi process tiep sang checkout cua stripe
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // day la cho truyen product thanh toan
        products: cart,
        customerEmail: session?.user.email,
        couponCode: appliedCoupon?.code,
      }),
    })
      .then(async res => {
        return res.json()
      })
      .then(async data => {
        if (data.session) {
          //call api create order truoc khi redirect user sang page checkout
          const dataCreateOrder = {
            userId: session?.user._id,
            address: '',
            phone: '',
            listProducts: cart.map((product: any) => {
              return {
                _id: product._id,
                quantityAddtoCart: product.quantityAddtoCart,
              }
            }),
            totalPrice: finalAmount,
            couponCode: appliedCoupon?.code || '',
            stripeCheckoutLink: data.session.url,
            checkOutSessionId: data.session.id,
          }
          const result = await createOrder(dataCreateOrder)
          // su dung webhook de update lai trang thai cua don hang -> isPaid = true
          result && router.push(data.session.url)
        }
      })
      .catch(err => {
        toast.error('Something went wrong!', {
          position: 'top-center',
        })
      })
      .finally(() => {
        setShowRedirect(false)
      })
  }

  const handleChangeQuantityInCart = (e: any, item: any) => {
    if (!e.target.value) {
      handleRemoveProduct(item)
      return
    }
    client.setQueryData(['User Cart'], (initalValue: any) => {
      const newValue = cloneDeep(initalValue)
      const index = newValue.findIndex((i: any) => i._id === item._id)
      newValue[index].quantityAddtoCart = e.target.value
      setCart(newValue)
      return newValue
    })
  }

  const handleRemoveProduct = (item: any) => {
    client.setQueryData(['User Cart'], (initalValue: any) => {
      const newValue = cloneDeep(initalValue)
      const result = newValue.filter((i: any) => i._id !== item._id)
      setCart(result)
      return result
    })
    toast.success(`Remove product ${item.name} successfully`, {
      position: 'top-center',
    })
  }

  return (
    <section className='modalCart'>
      <div className='box-cart'>
        <div className='title-box'>
          <p className='title-box-text'>Your Cart</p>
          <FontAwesomeIcon icon={faXmark} className='icon' onClick={() => setShowCart(false)} />
        </div>
        {isEmpty(cart) ? (
          <>
            <div className='empty-cart'>Your cart is empty</div>
            <button
              className='btn-continue'
              onClick={() => {
                if (path === '/shop') {
                  setShowCart(false)
                  return
                }
                router.push('/shop')
                setShowCart(false)
              }}
            >
              Go Shopping
            </button>
          </>
        ) : (
          <>
            <ul className='list-items'>
              {!isEmpty(cart) &&
                cart.map((item: any) => {
                  return (
                    <li className='item' key={item.id}>
                      <div className='item-img'>
                        <Image src={item.image} alt='' width={60} height={60} />
                      </div>
                      <div className='item-info'>
                        <p className='item-name'>{item.name}</p>
                        <p className='item-price'>${item.price}</p>
                        <p className='item-action' onClick={() => handleRemoveProduct(item)}>
                          Remove
                        </p>
                      </div>
                      <div className='item-quantity'>
                        <input
                          value={item.quantityAddtoCart}
                          type='number'
                          step={1}
                          defaultValue={1}
                          min={1}
                          max={999}
                          onChange={e => handleChangeQuantityInCart(e, item)}
                        />
                      </div>
                    </li>
                  )
                })}
            </ul>
            <ApplyCoupon
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              totalAmount={totalAmount}
              appliedCoupon={appliedCoupon}
            />
            <div className='total'>
              {appliedCoupon && (
                <>
                  <p className='total-text'>Original Total</p>
                  <p className='total-price'>${totalAmount.toFixed(2)} USD</p>
                  <p className='total-text'>Discount ({appliedCoupon.code})</p>
                  <p className='total-price' style={{ color: 'green' }}>-${appliedCoupon.discount.toFixed(2)}</p>
                </>
              )}
              <p className='total-text'>Total</p>
              <p className='total-price'>${finalAmount.toFixed(2)} USD</p>
            </div>
            <button className='btn-continue' onClick={showRedirect ? () => {} : handleCheckout}>
              {showRedirect ? 'Redirecting...' : 'Continue to Checkout'}
            </button>
          </>
        )}
      </div>
    </section>
  )
}
