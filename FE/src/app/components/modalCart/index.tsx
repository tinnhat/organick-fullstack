import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.scss'
import Image from 'next/image'
type Props = {}

export default function ModalCart({}: Props) {
  return (
    <section className='modalCart'>
      <div className='box-cart'>
        <div className='title-box'>
          <p className='title-box-text'>Your Cart</p>
          <FontAwesomeIcon icon={faXmark} className='icon' />
        </div>
        <ul className='list-items'>
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
              <input type='number' defaultValue={1} />
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
              <input type='number' defaultValue={1} />
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
              <input type='number' defaultValue={1} />
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
              <input type='number' defaultValue={1} />
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
              <input type='number' defaultValue={1} />
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
              <input type='number' defaultValue={1} />
            </div>
          </li>
        </ul>
        <div className='total'>
          <p className='total-text'>Total</p>
          <p className='total-price'>$13.00 USD</p>
        </div>
        <button className='btn-continue'>Continue to Checkout</button>
      </div>
    </section>
  )
}
