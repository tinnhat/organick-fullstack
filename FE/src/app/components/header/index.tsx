'use client'
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ModalCart from '../modalCart'
import './style.scss'

type Props = {}

export default function Header({}: Props) {
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()
  const handleShowCart = () => {
    setShowCart(true)
  }
  return (
    <header className='header'>
      <div className='container'>
        <div className='header-container'>
          <Link className='header-logo' href='/'>
            <Image
              src={'/assets/img/Logo.svg'}
              alt=''
              className='logo-img'
              width={50}
              height={50}
            />
            <p className='header-logo-name'>Organick</p>
          </Link>
          <div className='header-menu-mobile'>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <ul className='header-menu-list'>
            <li className='header-menu-item'>
              <Link href='/' className='header-menu-item-link'>
                Home
              </Link>
            </li>
            <li className='header-menu-item'>
              <Link href='/about' className='header-menu-item-link'>
                About
              </Link>
            </li>
            <li className='header-menu-item'>
              <Link href='/portfolio' className='header-menu-item-link'>
                Portfolio
              </Link>
            </li>
            <li className='header-menu-item'>
              <Link href='/shop' className='header-menu-item-link'>
                Shop
              </Link>
            </li>
            <li className='header-menu-item'>
              <Link href='/services' className='header-menu-item-link'>
                Services
              </Link>
            </li>
            <li className='header-menu-item'>
              <Link href='/quality' className='header-menu-item-link'>
                Quality
              </Link>
            </li>
          </ul>
          <div className='header-box-cart'>
            <div className='cart-box' onClick={handleShowCart}>
              <FontAwesomeIcon icon={faCartShopping} className='cart-box-icon' />
              <p className='cart-box-number'>Cart(0)</p>
            </div>
            <button className='btn-login' onClick={() => router.push('/login')}>
              Login
            </button>
            <div className='avatar-box'>
              <Image priority src={'/assets/img/avatar.jpg'} alt='' className='avatar-img' width={50} height={50} style={{
                borderRadius: '50%',
                cursor: 'pointer'
              }} />
              <div className='avatar-menu'>
                <div className='item' onClick={() => router.push('/my-account')}>My account</div>
                <div className='item'onClick={() => router.push('/order-history')}>Order History</div>
                <div className='item'>Sign out</div>
              </div>
            </div>
            {showCart && <ModalCart setShowCart={setShowCart} />}
          </div>
        </div>
      </div>
    </header>
  )
}
