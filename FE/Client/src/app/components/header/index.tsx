import React from 'react'
import './style.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMagnifyingGlass, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type Props = {}

export default function Header({}: Props) {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header-container'>
          <a className='header-logo' href='/'>
            <Image src={'/assets/img/Logo.svg'} alt='' className='logo-img' width={50} height={50} />
            <p className='header-logo-name'>Organick</p>
          </a>
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
            <div className='icon-box'>
              <FontAwesomeIcon icon={faMagnifyingGlass} className='icon-box-search' />
            </div>
            <div className='cart-box'>
              <FontAwesomeIcon icon={faCartShopping} className='cart-box-icon' />
              <p className='cart-box-number'>Cart(0)</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
