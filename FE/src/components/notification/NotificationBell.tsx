// ============ FEATURE: notifications START ============
'use client'
import { useState } from 'react'
import { Box, Badge, IconButton, useTheme } from '@mui/material'
import { Bell } from '@tabler/icons-react'
import NotificationPanel from './NotificationPanel'

const NotificationBell = ({ unreadCount = 0 }: { unreadCount?: number }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const theme = useTheme()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <Badge
          badgeContent={unreadCount > 99 ? '99+' : unreadCount}
          color='error'
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '10px',
              height: '18px',
              minWidth: '18px',
            },
          }}
        >
          <IconButton
            data-testid="notification-bell"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Bell size={22} />
          </IconButton>
        </Badge>
      </Box>
      <NotificationPanel anchorEl={anchorEl} onClose={handleClose} />
    </>
  )
}

export default NotificationBell
// ============ FEATURE: notifications END ============
