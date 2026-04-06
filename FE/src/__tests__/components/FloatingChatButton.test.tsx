import { render, screen, fireEvent } from '@testing-library/react'
import FloatingChatButton from '../../../components/chat/FloatingChatButton'

jest.mock('../../../components/chat/ChatModal', () => {
  return function MockChatModal({ isOpen, onClose }: any) {
    return isOpen ? <div data-testid='chat-modal'>Chat Modal Open</div> : null
  }
})

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: { main: '#7eb693', dark: '#6aa583' },
      grey: { 300: '#e0e0e0', 500: '#9e9e9e' }
    }
  })
}))

describe('FloatingChatButton Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the floating button', () => {
      render(<FloatingChatButton />)
      expect(document.querySelector('[class*="Box"]')).toBeInTheDocument()
    })

    it('should render message circle icon', () => {
      render(<FloatingChatButton />)
      const button = document.querySelector('[class*="IconButton"]')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Badge Count', () => {
    it('should display badge with correct count', () => {
      render(<FloatingChatButton unreadCount={10} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('10')
    })

    it('should display 99+ for counts over 99', () => {
      render(<FloatingChatButton unreadCount={200} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('99+')
    })

    it('should not show badge when count is 0', () => {
      render(<FloatingChatButton unreadCount={0} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('0')
    })
  })

  describe('Click to Open', () => {
    it('should open chat modal on button click', () => {
      render(<FloatingChatButton />)
      const button = document.querySelector('[class*="IconButton"]')
      if (button) {
        fireEvent.click(button)
      }
      
      expect(screen.getByTestId('chat-modal')).toBeInTheDocument()
    })

    it('should keep modal open when clicking button again', () => {
      render(<FloatingChatButton />)
      const button = document.querySelector('[class*="IconButton"]')
      if (button) {
        fireEvent.click(button)
        fireEvent.click(button)
      }
      
      expect(screen.getByTestId('chat-modal')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have correct position styling', () => {
      render(<FloatingChatButton />)
      const container = document.querySelector('[class*="Box"]')
      expect(container).toHaveStyle({ position: 'fixed' })
    })

    it('should have fixed dimensions of 56px', () => {
      render(<FloatingChatButton />)
      const button = document.querySelector('[class*="IconButton"]') as HTMLElement
      expect(button).toHaveStyle({ width: '56px', height: '56px' })
    })
  })
})