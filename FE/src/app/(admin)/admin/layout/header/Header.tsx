import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import Logo from '../shared/logo/Logo'
// components
import { IconMenu2 } from '@tabler/icons-react'
import Profile from './Profile'

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void
}

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow:
    'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px !important;',
  background: theme.palette.primary.main,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.up('lg')]: {
    minHeight: '64px'
  }
}))
const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary
}))

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return (
    <AppBarStyled position='sticky' color='default'>
      <ToolbarStyled>
        <Box
          sx={{
            width: '256px'
          }}
        >
          <Logo />
        </Box>
        <IconButton
          color='inherit'
          aria-label='menu'
          onClick={toggleMobileSidebar}
          sx={{
            color: '#fff',
            display: {
              lg: 'none',
              xs: 'flex'
            }
          }}
        >
          <IconMenu2 width='22' height='22' />
        </IconButton>
        <Box flexGrow={1} />
        <Stack spacing={1} direction='row' alignItems='center'>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  )
}

Header.propTypes = {
  sx: PropTypes.object
}

export default Header
