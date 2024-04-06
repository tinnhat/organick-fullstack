import Link from 'next/link'
import { styled } from '@mui/material'
import Image from 'next/image'

const LinkStyled = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
}))

const TextStyled = styled('p')(() => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#fff',
  paddingLeft: '4px',
  margin: 0,
}))

const Logo = () => {
  return (
    <LinkStyled className='header-logo' href='/'>
      <Image
        src={'/assets/img/Logo.svg'}
        alt=''
        className='logo-img'
        width={50}
        height={50}
        priority
      />
      <TextStyled className='header-logo-name'>Organick</TextStyled>
    </LinkStyled>
  )
}

export default Logo
