// ============ FEATURE: notifications START ============
'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Popover,
  CircularProgress,
} from '@mui/material'
import { X, Package, ChatCircle, Star, Bell as BellIcon, DotsThreeVertical } from '@phosphor-icons/react'
import { useNotifications } from '@/hooks/useNotifications'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface NotificationPanelProps {
  anchorEl: HTMLElement | null
  onClose: () => void
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

const NotificationPanel = ({ anchorEl, onClose }: NotificationPanelProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } =
    useNotifications()
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; notificationId: string } | null>(
    null
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('.notification-panel')) {
          onClose()
        }
      }
    }

    if (anchorEl) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [anchorEl, onClose])

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
    if (notification.relatedId) {
      if (notification.type === 'order') {
        window.location.href = `/admin/orders/${notification.relatedId}`
      } else if (notification.type === 'chat') {
        window.location.href = '/admin/chat'
      }
    }
    onClose()
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    event.stopPropagation()
    setMenuAnchor({ el: event.currentTarget, notificationId })
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId)
    handleMenuClose()
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPopover-paper': {
          width: '360px',
          maxHeight: '480px',
          mt: 1,
        },
      }}
    >
      <Paper className='notification-panel' elevation={0} sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant='subtitle1' fontWeight={600}>
            Notifications
            {unreadCount > 0 && (
              <Typography component='span' color='error' sx={{ ml: 1 }}>
                ({unreadCount})
              </Typography>
            )}
          </Typography>
          {unreadCount > 0 && (
            <Button size='small' onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Box>

        <Box sx={{ maxHeight: '360px', overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <BellIcon size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
              <Typography color='text.secondary'>No notifications yet</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItemButton
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                    borderLeft: notification.isRead ? 'none' : '3px solid',
                    borderColor: getNotificationColor(notification.type),
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      color: getNotificationColor(notification.type),
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body2'
                        fontWeight={notification.isRead ? 'normal' : 600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '200px',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box component='span'>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '220px',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant='caption' color='text.disabled'>
                          {dayjs(notification.createdAt).fromNow()}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {!notification.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          mr: 1,
                        }}
                      />
                    )}
                    <IconButton
                      size='small'
                      onClick={(e) => handleMenuClick(e, notification._id)}
                    >
                      <DotsThreeVertical size={16} />
                    </IconButton>
                  </Box>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Button
            size='small'
            onClick={() => {
              window.location.href = '/admin/notifications'
              onClose()
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Paper>

      <Popover
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor?.el}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Button
            size='small'
            color='error'
            startIcon={<X size={16} />}
            onClick={() => handleDelete(menuAnchor?.notificationId || '')}
          >
            Delete
          </Button>
        </Box>
      </Popover>
    </Popover>
  )
}

export default NotificationPanel
// ============ FEATURE: notifications END ============
