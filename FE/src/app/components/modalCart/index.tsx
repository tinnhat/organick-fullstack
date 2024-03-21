import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './style.scss'
import { ProductsMock } from '@/app/common/mockData'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

type Props = {
  setShowCart: (value: boolean) => void
}

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ModalCart({ setShowCart }: Props) {
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
        products: [{ ...ProductsMock[2], quantityCheckout: 2 }],
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
  
  console.log(cart);
  

  return (
    <section className='modalCart'>
      <div className='box-cart'>
        <div className='title-box'>
          <p className='title-box-text'>Your Cart</p>
          <FontAwesomeIcon icon={faXmark} className='icon' onClick={() => setShowCart(false)} />
        </div>
        <ul className='list-items'>
          {!isEmpty(cart) && cart.map((item: any) => {
            return (
              <li className='item' key={item.id}>
                <div className='item-img'>
                  <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
                </div>
                <div className='item-info'>
                  <p className='item-name'>
                    Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli
                    Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli Calabrese Broccoli
                    Calabrese Broccoli
                  </p>
                  <p className='item-price'>$13.00</p>
                  <p className='item-action'>Remove</p>
                </div>
                <div className='item-quantity'>
                  <input type='number' defaultValue={1} min={1} max={999} />
                </div>
              </li>
            )
          })}

          {/* <li className='item'>
            <div className='item-img'>
              <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
            </div>
            <div className='item-info'>
              <p className='item-name'>Calabrese Broccoli</p>
              <p className='item-price'>$13.00</p>
              <p className='item-action'>Remove</p>
            </div>
            <div className='item-quantity'>
              <input type='number' defaultValue={1} min={1} max={999} />
            </div>
          </li>
          <li className='item'>
            <div className='item-img'>
              <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
            </div>
            <div className='item-info'>
              <p className='item-name'>Calabrese Broccoli</p>
              <p className='item-price'>$13.00</p>
              <p className='item-action'>Remove</p>
            </div>
            <div className='item-quantity'>
              <input type='number' defaultValue={1} min={1} max={999} />
            </div>
          </li>
          <li className='item'>
            <div className='item-img'>
              <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
            </div>
            <div className='item-info'>
              <p className='item-name'>Calabrese Broccoli</p>
              <p className='item-price'>$13.00</p>
              <p className='item-action'>Remove</p>
            </div>
            <div className='item-quantity'>
              <input type='number' defaultValue={1} min={1} max={999} />
            </div>
          </li>
          <li className='item'>
            <div className='item-img'>
              <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
            </div>
            <div className='item-info'>
              <p className='item-name'>Calabrese Broccoli</p>
              <p className='item-price'>$13.00</p>
              <p className='item-action'>Remove</p>
            </div>
            <div className='item-quantity'>
              <input type='number' defaultValue={1} min={1} max={999} />
            </div>
          </li>
          <li className='item'>
            <div className='item-img'>
              <Image src={'/assets/img/product1.png'} alt='' width={60} height={60} />
            </div>
            <div className='item-info'>
              <p className='item-name'>Calabrese Broccoli</p>
              <p className='item-price'>$13.00</p>
              <p className='item-action'>Remove</p>
            </div>
            <div className='item-quantity'>
              <input type='number' defaultValue={1} min={1} max={999} />
            </div>
          </li> */}
        </ul>
        <div className='total'>
          <p className='total-text'>Total</p>
          <p className='total-price'>$13.00 USD</p>
        </div>
        <button className='btn-continue' onClick={handleCheckout}>
          {showRedirect ? 'Redirecting...' : 'Continue to Checkout'}
        </button>
      </div>
    </section>
  )
}
