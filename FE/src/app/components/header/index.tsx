'use client'
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import ModalCart from '../modalCart'
import './style.scss'
import { useQuery } from '@tanstack/react-query'

type Props = {}
const paths = ['/home', '/about', '/shop', '/portfolio', '/services', '/quality']
export default function Header({}: Props) {
  const { data: user } = useQuery<any>({ queryKey: ['User Cart'] })
  const pathName = usePathname()
  const { data: session } = useSession()
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()
  const handleShowCart = () => {
    setShowCart(true)
  }
  console.log(session)

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
            {paths.map((path, index) => {
              return (
                <li key={index} className='header-menu-item'>
                  <Link
                    href={path}
                    className={`header-menu-item-link ${
                      pathName === path.toLowerCase() ? 'active' : ''
                    }`}
                  >
                    {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className='header-box-cart'>
            <div className='cart-box' onClick={handleShowCart}>
              <FontAwesomeIcon icon={faCartShopping} className='cart-box-icon' />
              <p className='cart-box-number'>Cart({user ? user.length : 0})</p>
            </div>
            {session ? (
              <div className='avatar-box'>
                <Image
                  priority
                  src={'/assets/img/avatar.jpg'}
                  alt=''
                  className='avatar-img'
                  width={50}
                  height={50}
                  style={{
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                />
                <div className='avatar-menu'>
                  <div className='item' onClick={() => router.push('/my-account')}>
                    My account
                  </div>
                  <div className='item' onClick={() => router.push('/order-history')}>
                    Order History
                  </div>
                  <div className='item' onClick={() => signOut()}>
                    Sign out
                  </div>
                </div>
              </div>
            ) : (
              <button className='btn-login' onClick={() => router.push('/login')}>
                Login
              </button>
            )}
            {showCart && <ModalCart setShowCart={setShowCart} />}
          </div>
        </div>
      </div>
    </header>
  )
}
