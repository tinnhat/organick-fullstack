import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import './style.scss'
import { ProductsMock } from '@/app/common/mockData'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep, isEmpty } from 'lodash'
import client from '@/app/client'

type Props = {
  setShowCart: (value: boolean) => void
}

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ModalCart({ setShowCart }: Props) {
  const path = usePathname()
  const [cart, setCart] = useState<any>()
  const router = useRouter()
  const { data: user } = useQuery<any>({ queryKey: ['User Cart'] })
  const [showRedirect, setShowRedirect] = useState(false)
  useEffect(() => {
    if (!isEmpty(user)) {
      setCart(user)
    }
  }, [user])

  const handleCheckout = async () => {
    setShowRedirect(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // day la cho truyen product thanh toan
        products: cart,
      }),
    })
      .then(async res => {
        return res.json()
      })
      .then(async data => {
        if (data.session) {
          router.push(data.session.url)
        }
      })
      .catch(err => {
        console.log(err)
        toast.error('Something went wrong!', {
          position: 'top-center',
        })
      })
      .finally(() => {
        setShowRedirect(false)
      })
  }

  // console.log(cart)
  const handleChangeQuantityInCart = (e:any,item: any) => {
    client.setQueryData(['User Cart'], (initalValue: any) => {
      const newValue = cloneDeep(initalValue)
      const index = newValue.findIndex((i: any) => i._id === item._id)
      newValue[index].quantityAddCart = e.target.value
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
                        <p className='item-name'>
                          {item.name}
                        </p>
                        <p className='item-price'>${item.price}</p>
                        <p className='item-action' onClick={() => handleRemoveProduct(item)} >Remove</p>
                      </div>
                      <div className='item-quantity'>
                        <input value={item.quantityAddCart} type='number' defaultValue={1} min={1} max={999} onChange={(e) => handleChangeQuantityInCart(e,item)} />
                      </div>
                    </li>
                  )
                })}
            </ul>
            <div className='total'>
              <p className='total-text'>Total</p>
              <p className='total-price'>$13.00 USD</p>
            </div>
            <button className='btn-continue' onClick={handleCheckout}>
              {showRedirect ? 'Redirecting...' : 'Continue to Checkout'}
            </button>
          </>
        )}
      </div>
    </section>
  )
}
