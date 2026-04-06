// ============ FEATURE: notifications START ============
'use client'
import { useEffect, useState } from 'react'
import { Box, Typography, Paper, IconButton, Slide, useTheme } from '@mui/material'
import { X, Package, ChatCircle, Star, Bell as BellIcon } from '@phosphor-icons/react'
import { Notification } from '@/app/type.d'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface ToastNotificationProps {
  notification: Notification
  onClose: () => void
  onClick?: () => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <Package size={20} weight='fill' />
    case 'chat':
      return <ChatCircle size={20} weight='fill' />
    case 'review':
      return <Star size={20} weight='fill' />
    default:
      return <BellIcon size={20} weight='fill' />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order':
      return '#2196f3'
    case 'chat':
      return '#4caf50'
    case 'review':
      return '#ff9800'
    default:
      return '#9c27b0'
  }
}

const ToastNotification = ({ notification, onClose, onClick }: ToastNotificationProps) => {
  const theme = useTheme()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Slide direction='left' in={isVisible} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        onClick={onClick}
        sx={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          width: '320px',
          p: 2,
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          backgroundColor: theme.palette.background.paper,
          borderLeft: '4px solid',
          borderColor: getNotificationColor(notification.type),
          zIndex: theme.zIndex.snackbar + 1,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Box
          sx={{
            color: getNotificationColor(notification.type),
            mt: 0.25,
          }}
        >
          {getNotificationIcon(notification.type)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant='subtitle2' fontWeight={600}>
            {notification.title}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {notification.message}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            {dayjs(notification.createdAt).fromNow()}
          </Typography>
        </Box>
        <IconButton
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          sx={{ mt: -0.5, mr: -0.5 }}
        >
          <X size={16} />
        </IconButton>
      </Paper>
    </Slide>
  )
}

export default ToastNotification
// ============ FEATURE: notifications END ============
