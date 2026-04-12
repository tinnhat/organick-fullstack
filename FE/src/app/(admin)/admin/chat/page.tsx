// ============ FEATURE: websocket-chat START ============
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  useTheme,
  InputAdornment,
} from '@mui/material'
import { PaperPlaneRight, MagnifyingGlass, Circle } from '@phosphor-icons/react'
import { useSocket } from '@/hooks/useSocket'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useSession } from 'next-auth/react'
import { Message, Conversation } from '@/app/type.d'
import MessageBubble from '@/components/chat/MessageBubble'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function AdminChatPage() {
  const theme = useTheme()
  const { data: session } = useSession()
  const { socket, isConnected } = useSocket()
  const { isOnline } = useOnlineStatus()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (!socket) return

    const handleConversationsList = (data: Conversation[]) => {
      setConversations(data)
      setIsLoading(false)
    }

    const handleMessagesHistory = (history: Message[]) => {
      setMessages(history)
    }

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message])
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === message.senderId
            ? { ...conv, lastMessage: message.content, lastMessageAt: message.createdAt }
            : conv
        )
      )
    }

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === selectedUser) {
        setIsTyping(data.isTyping)
        setTypingUser(data.isTyping ? data.userId : null)
      }
    }

    const handleUnreadUpdate = (data: { userId: string; unreadCount: number }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === data.userId ? { ...conv, unreadCount: data.unreadCount } : conv
        )
      )
    }

    socket.emit('getConversations')
    setIsLoading(true)

    socket.on('conversationsList', handleConversationsList)
    socket.on('messagesHistory', handleMessagesHistory)
    socket.on('newMessage', handleNewMessage)
    socket.on('typing', handleTyping)
    socket.on('unreadUpdate', handleUnreadUpdate)

    return () => {
      socket.off('conversationsList', handleConversationsList)
      socket.off('messagesHistory', handleMessagesHistory)
      socket.off('newMessage', handleNewMessage)
      socket.off('typing', handleTyping)
      socket.off('unreadUpdate', handleUnreadUpdate)
    }
  }, [socket, selectedUser])

  useEffect(() => {
    if (!socket || !selectedUser) return

    socket.emit('markAsRead', {
      userId: session?.user?._id,
      targetUserId: selectedUser,
    })

    setConversations((prev) =>
      prev.map((conv) =>
        conv.userId === selectedUser ? { ...conv, unreadCount: 0 } : conv
      )
    )
  }, [selectedUser, socket, session?.user?._id])

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    socket?.emit('getMessages', {
      userId: session?.user?._id,
      targetUserId: userId,
    })
  }

  const handleSend = () => {
    if (!inputValue.trim() || !selectedUser) return

    socket?.emit('sendMessage', {
      senderId: session?.user?._id,
      receiverId: selectedUser,
      content: inputValue.trim(),
    })

    setInputValue('')
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    socket?.emit('typing', {
      userId: session?.user?._id,
      targetUserId: selectedUser,
      isTyping: true,
    })
  }

  const handleInputBlur = () => {
    socket?.emit('typing', {
      userId: session?.user?._id,
      targetUserId: selectedUser,
      isTyping: false,
    })
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConversation = conversations.find((conv) => conv.userId === selectedUser)

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 140px)', gap: 2 }}>
      <Paper
        sx={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Messages
          </Typography>
          <TextField
            fullWidth
            size='small'
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <MagnifyingGlass size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredConversations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color='text.secondary'>No conversations yet</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredConversations.map((conv) => (
                <ListItemButton
                  key={conv.userId}
                  selected={selectedUser === conv.userId}
                  onClick={() => handleUserSelect(conv.userId)}
                  sx={{
                    borderLeft: selectedUser === conv.userId ? '3px solid' : 'none',
                    borderColor: 'primary.main',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={
                        conv.unreadCount > 0 ? (conv.unreadCount > 99 ? '99+' : conv.unreadCount) : 0
                      }
                      color='error'
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '9px',
                          height: '16px',
                          minWidth: '16px',
                        },
                      }}
                    >
                      <Avatar sx={{ width: 40, height: 40 }} alt={conv.userName} src={conv.userAvatar}>
                        {conv.userName.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant='body2'
                          fontWeight={conv.unreadCount > 0 ? 600 : 'normal'}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '140px',
                          }}
                        >
                          {conv.userName}
                        </Typography>
                        <Circle
                          size={8}
                          weight='fill'
                          style={{
                            color: isOnline(conv.userId) ? '#4ade80' : '#9ca3af',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            maxWidth: '180px',
                          }}
                        >
                          {conv.lastMessage || 'No messages yet'}
                        </Typography>
                        {conv.lastMessageAt && (
                          <Typography variant='caption' color='text.disabled'>
                            {dayjs(conv.lastMessageAt).fromNow()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedUser && selectedConversation ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  alt={selectedConversation.userName}
                  src={selectedConversation.userAvatar}
                >
                  {selectedConversation.userName.charAt(0)}
                </Avatar>
                {isOnline(selectedUser) && (
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
                  {selectedConversation.userName}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {isOnline(selectedUser) ? 'Online' : 'Offline'}
                </Typography>
              </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                  <Typography variant='caption' color='text.secondary'>
                    {selectedConversation.userName} is typing...
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
                borderTop: '1px solid',
                borderColor: 'divider',
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
                disabled={!isConnected}
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
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color='text.secondary'>Select a conversation to start chatting</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
// ============ FEATURE: websocket-chat END ============
