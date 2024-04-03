'use client'
import { useGetUserInfoQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import ModalCart from '../modalCart'
import './style.scss'
import { DotLoader } from 'react-spinners'

type Props = {}
const paths = ['/home', '/about', '/shop', '/portfolio', '/services', '/quality']
export default function Header({}: Props) {
  const fetchApi = useFetch()
  const { data: userCart } = useQuery<any>({ queryKey: ['User Cart'] })
  const { data: session, status } = useSession()
  const { data: userInfo, isLoading } = useGetUserInfoQuery(fetchApi, session?.user?._id)
  const pathName = usePathname()
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()
  const handleShowCart = () => {
    setShowCart(true)
  }
  console.log(status)

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
              priority
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
              <p className='cart-box-number'>Cart({userCart ? userCart.length : 0})</p>
            </div>
            {status === 'authenticated' ? (
              <div className='avatar-box'>
                {isLoading ? (
                  <DotLoader size={20} color='#274c5b' />
                ) : (
                  <Image
                    priority
                    src={userInfo?.avatar}
                    alt=''
                    className='avatar-img'
                    width={50}
                    height={50}
                    style={{
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  />
                )}
                <div className='avatar-menu'>
                  <div className='item' onClick={() => router.push('/my-account')}>
                    My account
                  </div>
                  <div className='item' onClick={() => router.push('/order-history')}>
                    Order History
                  </div>
                  {userInfo?.isAdmin && (
                    <div className='item' onClick={() => router.push('/admin')}>
                      Admin
                    </div>
                  )}
                  <div className='item' onClick={() => signOut()}>
                    Logout
                  </div>
                </div>
              </div>
            ) : status === 'loading' ? (
              <div className='loading-container'>
                <div className='loading-text'>Loading...</div>
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
