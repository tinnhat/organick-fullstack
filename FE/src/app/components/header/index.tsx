'use client'
import { useGetUserInfoQuery } from '@/app/utils/hooks/usersHooks'
import useFetch from '@/app/utils/useFetch'
import { GearSix, Receipt, ShoppingCart, SignOut, User, Heart } from '@phosphor-icons/react'
import { Badge, Menu, MenuItem } from '@mui/material'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import ModalCart from '../modalCart'
import ModalWishlist from '../../../components/wishlistModal'
import './style.scss'
import { DotLoader } from 'react-spinners'


const paths = ['/home', '/about', '/shop', '/portfolio', '/services', '/quality']
export default function Header() {
  const fetchApi = useFetch()
  const { data: userCart } = useQuery<any>({ queryKey: ['User Cart'] })
  const { data: wishlist } = useQuery<any>({ queryKey: ['User Wishlist'] })
  const { data: session, status } = useSession()
  const { data: userInfo, isLoading } = useGetUserInfoQuery(fetchApi, session?.user?._id)
  const pathName = usePathname()
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const handleShowCart = () => {
    setShowCart(true)
  }
  const handleShowWishlist = () => {
    setShowWishlist(true)
  }
  const open = Boolean(anchorEl)
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
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
            <Badge
              badgeContent={wishlist && wishlist.length > 0 ? wishlist.length : 0}
              color='error'
              sx={{
                '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px' },
              }}
            >
              <div className='icon-btn' onClick={handleShowWishlist} role='button' aria-label='Wishlist'>
                <Heart size={22} />
              </div>
            </Badge>
            <Badge
              badgeContent={userCart && userCart.length > 0 ? userCart.length : 0}
              color='error'
              sx={{
                '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px' },
              }}
            >
              <div className='icon-btn' onClick={handleShowCart} role='button' aria-label='Cart'>
                <ShoppingCart size={22} />
              </div>
            </Badge>
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
                    onClick={handleAvatarClick}
                  />
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { router.push('/my-account'); handleMenuClose(); }}>
                    <User size={18} style={{ marginRight: 10 }} /> My Account
                  </MenuItem>
                  <MenuItem onClick={() => { router.push('/order-history'); handleMenuClose(); }}>
                    <Receipt size={18} style={{ marginRight: 10 }} /> Order History
                  </MenuItem>
                  {userInfo?.isAdmin && (
                    <MenuItem onClick={() => { router.push('/admin'); handleMenuClose(); }}>
                      <GearSix size={18} style={{ marginRight: 10 }} /> Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => signOut()}>
                    <SignOut size={18} style={{ marginRight: 10 }} /> Logout
                  </MenuItem>
                </Menu>
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
            {showWishlist && <ModalWishlist open={showWishlist} onClose={() => setShowWishlist(false)} />}
          </div>
        </div>
      </div>
    </header>
  )
}
