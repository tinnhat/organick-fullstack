// ============ FEATURE: websocket-chat START ============
'use client'
import { Box, Typography, IconButton, Popover } from '@mui/material'
import { Trash } from '@phosphor-icons/react'
import { Message } from '@/app/type.d'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface MessageBubbleProps {
  message: Message
  isSent: boolean
}

const MessageBubble = ({ message, isSent }: MessageBubbleProps) => {
  const { data: session } = useSession()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const canDelete =
    message.senderId === session?.user?._id &&
    dayjs().diff(dayjs(message.createdAt), 'minute') < 5

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleDeleteClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // Emit delete event to socket
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          maxWidth: '75%',
          p: 1.5,
          borderRadius: isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isSent ? '#274c5b' : '#fff',
          color: isSent ? '#fff' : 'text.primary',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          position: 'relative',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant='body2'>{message.content}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSent ? 'flex-end' : 'flex-start',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Typography
            variant='caption'
            sx={{
              opacity: 0.7,
              fontSize: '10px',
            }}
          >
            {dayjs(message.createdAt).fromNow()}
          </Typography>
          {canDelete && (
            <IconButton
              size='small'
              onClick={handleDeleteClick}
              sx={{
                p: 0,
                ml: 0.5,
                opacity: 0.5,
                '&:hover': { opacity: 1 },
              }}
            >
              <Trash size={12} />
            </IconButton>
          )}
        </Box>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleDeleteClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isSent ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: isSent ? 'right' : 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography
            variant='body2'
            sx={{ cursor: 'pointer', '&:hover': { color: 'error.main' } }}
            onClick={handleDelete}
          >
            Delete message?
          </Typography>
        </Box>
      </Popover>
    </Box>
  )
}

export default MessageBubble
// ============ FEATURE: websocket-chat END ============
