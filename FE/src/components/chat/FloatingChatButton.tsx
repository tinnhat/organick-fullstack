// ============ FEATURE: websocket-chat START ============
'use client'
import { useState } from 'react'
import { Box, Badge, IconButton, useTheme } from '@mui/material'
import { MessageCircle } from '@tabler/icons-react'
import ChatModal from './ChatModal'

const FloatingChatButton = ({ unreadCount = 0 }: { unreadCount?: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: theme.zIndex.modal + 1,
        }}
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
            onClick={() => setIsOpen(true)}
            data-testid="chat-button"
            sx={{
              width: '56px',
              height: '56px',
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <MessageCircle size={28} />
          </IconButton>
        </Badge>
      </Box>
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default FloatingChatButton
// ============ FEATURE: websocket-chat END ============
