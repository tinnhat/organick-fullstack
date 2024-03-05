'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
const Footer = () => {
  return (
    <Box sx={{ pt: 6, textAlign: 'center' }}>
      <Typography>
        © {new Date().getFullYear()} All rights reserved by NT
      </Typography>
    </Box>
  )
}

export default Footer
