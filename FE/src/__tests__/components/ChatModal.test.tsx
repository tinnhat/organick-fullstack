import { render, screen, fireEvent } from '@testing-library/react'
import ChatModal from '../../../components/chat/ChatModal'

jest.mock('../../../hooks/useChat', () => ({
  useChat: () => ({
    messages: [
      { _id: 'msg1', senderId: 'user1', content: 'Hello', timestamp: new Date(), isRead: false, isDeleted: false },
      { _id: 'msg2', senderId: 'admin', content: 'Hi there!', timestamp: new Date(), isRead: true, isDeleted: false }
    ],
    sendMessage: jest.fn(),
    isTyping: false,
    setTyping: jest.fn(),
    markAsRead: jest.fn(),
    isConnected: true
  })
}))

jest.mock('../../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => ({
    isOnline: () => true
  })
}))

jest.mock('../../../hooks/useSocket', () => ({
  useSocket: () => ({
    socket: {},
    connected: true
  })
}))

jest.mock('../../../hooks/useChat', () => ({
  useChat: jest.fn()
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { _id: 'user1', name: 'Test User' } }
  })
}))

describe('ChatModal Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      expect(screen.getByText('Admin Support')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      render(<ChatModal isOpen={false} onClose={mockOnClose} />)
      expect(screen.queryByText('Admin Support')).not.toBeInTheDocument()
    })
  })

  describe('Messages Display', () => {
    it('should display messages', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()
    })
  })

  describe('Input Field', () => {
    it('should have a text input field', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      const input = screen.getByPlaceholderText('Type a message...')
      expect(input).toBeInTheDocument()
    })

    it('should update input value on change', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      const input = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Test message' } })
      expect(input.value).toBe('Test message')
    })
  })

  describe('Send Message', () => {
    it('should call sendMessage when send button is clicked', () => {
      const sendMessageMock = jest.fn()
      require('../../../hooks/useChat').useChat.mockReturnValue({
        messages: [],
        sendMessage: sendMessageMock,
        isTyping: false,
        setTyping: jest.fn(),
        markAsRead: jest.fn(),
        isConnected: true
      })

      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      const input = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Test message' } })
      
      const sendButton = document.querySelector('[class*="IconButton"]')
      if (sendButton) {
        fireEvent.click(sendButton)
      }
      
      expect(sendMessageMock).toHaveBeenCalledWith('Test message')
    })

    it('should clear input after sending', () => {
      const sendMessageMock = jest.fn()
      require('../../../hooks/useChat').useChat.mockReturnValue({
        messages: [],
        sendMessage: sendMessageMock,
        isTyping: false,
        setTyping: jest.fn(),
        markAsRead: jest.fn(),
        isConnected: true
      })

      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      const input = screen.getByPlaceholderText('Type a message...') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Test message' } })
      
      const sendButton = document.querySelector('[class*="IconButton"]:last-child')
      if (sendButton) {
        fireEvent.click(sendButton)
      }
      
      expect(input.value).toBe('')
    })
  })

  describe('Close Button', () => {
    it('should call onClose when close button is clicked', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      const closeButton = document.querySelector('[class*="IconButton"]')
      if (closeButton) {
        fireEvent.click(closeButton)
      }
      
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Connection Status', () => {
    it('should show "Connecting..." when not connected', () => {
      require('../../../hooks/useChat').useChat.mockReturnValue({
        messages: [],
        sendMessage: jest.fn(),
        isTyping: false,
        setTyping: jest.fn(),
        markAsRead: jest.fn(),
        isConnected: false
      })

      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      expect(screen.getByText('Connecting...')).toBeInTheDocument()
    })

    it('should show "Online" when connected and admin is online', () => {
      render(<ChatModal isOpen={true} onClose={mockOnClose} />)
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })
})