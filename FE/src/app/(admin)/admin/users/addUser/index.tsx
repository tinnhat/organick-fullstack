import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import React from 'react'

type Props = {
  open: boolean
  toggleDrawer: (val: boolean) => void
}

export default function AddUser({ open, toggleDrawer }: Props) {
  const handleClose = () => {
    toggleDrawer(false)
  }
  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90vw', md: '80vw', lg: '60vw' }
        }
      }}
      variant='temporary'
      anchor='right'
      open={open}
    >
      <p>123</p>
      <Button onClick={handleClose}>Close</Button>
    </Drawer>
  )
}
