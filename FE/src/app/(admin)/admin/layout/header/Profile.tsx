import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import { useState } from 'react'


const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null)
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  return (
    <Box>
      <IconButton
        size='large'
        aria-label='menu'
        color='inherit'
        aria-controls='msgs-menu'
        aria-haspopup='true'
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            borderRadius: '9px'
          })
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={'/images/users/user2.jpg'}
          alt={'ProfileImg'}
          sx={{
            width: 35,
            height: 35
          }}
        />
      </IconButton>
      <Menu
        id='msgs-menu'
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 2,
            pb: 2,
            pt: 0
          }
        }}
      >
        <Box pt={0}>
          <List>
            <ListItemButton component={Link} href='/admin/my-profile'>
              <ListItemText primary='My Profile' />
            </ListItemButton>
            <ListItemButton component={Link} href='/admin/change-password'>
              <ListItemText primary='Change Password' />
            </ListItemButton>
            <ListItemButton component='a' href='/home'>
              <ListItemText primary='Switch to client' />
            </ListItemButton>
          </List>
        </Box>
        <Divider />
        <Box mt={2}>
          <Button fullWidth variant='contained' color='primary'>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  )
}

export default Profile
