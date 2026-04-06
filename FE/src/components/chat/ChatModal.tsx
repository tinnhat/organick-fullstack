// ============ FEATURE: websocket-chat START ============
'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Avatar,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { X, PaperPlaneRight, Circle } from '@phosphor-icons/react'
import { useChat } from '@/hooks/useChat'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import MessageBubble from './MessageBubble'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/useSocket'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const ADMIN_ID = 'admin'

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { data: session } = useSession()
  const { socket } = useSocket()
  const { isOnline } = useOnlineStatus()
  const { messages, sendMessage, isTyping, setTyping, markAsRead, isConnected } = useChat(
    ADMIN_ID
  )
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && session?.user?._id) {
      markAsRead()
    }
  }, [isOpen, session?.user?._id])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue.trim())
    setInputValue('')
    setTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setTyping(true)
  }

  const handleInputBlur = () => {
    setTyping(false)
  }

  return (
    <Slide direction='up' in={isOpen} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        data-testid="chat-modal"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 0 : '88px',
          right: isMobile ? 0 : '24px',
          width: isMobile ? '100%' : '380px',
          height: isMobile ? '100%' : '580px',
          maxHeight: 'calc(100vh - 120px)',
          borderRadius: isMobile ? 0 : '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: theme.zIndex.modal + 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ width: 40, height: 40 }}
                alt='Admin'
                src='/assets/img/admin-avatar.png'
              />
              {isOnline(ADMIN_ID) && (
                <Circle
                  size={12}
                  weight='fill'
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    color: '#4ade80',
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography variant='subtitle1' fontWeight={600}>
                Admin Support
              </Typography>
              <Typography variant='caption' sx={{ opacity: 0.8 }}>
                {isConnected ? (isOnline(ADMIN_ID) ? 'Online' : 'Away') : 'Connecting...'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff' }} data-testid="close-chat">
            <X size={24} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: theme.palette.grey[100],
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isSent={message.senderId === session?.user?._id}
            />
          ))}
          {isTyping && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pl: 1,
              }}
            >
              <Typography variant='caption' color='text.secondary'>
                Admin is typing...
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  '& span': {
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.text.secondary,
                    animation: 'bounce 1.4s infinite ease-in-out',
                    '&:nth-of-type(1)': { animationDelay: '-0.32s' },
                    '&:nth-of-type(2)': { animationDelay: '-0.16s' },
                  },
                  '@keyframes bounce': {
                    '0%, 80%, 100%': { transform: 'scale(0)' },
                    '40%': { transform: 'scale(1)' },
                  },
                }}
              >
                <span />
                <span />
                <span />
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: '#fff',
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size='small'
            placeholder='Type a message...'
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleInputBlur}
            multiline
            maxRows={4}
            data-testid="chat-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected}
            data-testid="send-button"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              },
            }}
          >
            <PaperPlaneRight size={20} />
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  )
}

export default ChatModal
// ============ FEATURE: websocket-chat END ============
