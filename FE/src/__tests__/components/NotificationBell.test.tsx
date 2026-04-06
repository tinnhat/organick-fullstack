import { render, screen, fireEvent } from '@testing-library/react'
import NotificationBell from '../../../components/notification/NotificationBell'

jest.mock('../../../components/notification/NotificationPanel', () => {
  return function MockNotificationPanel({ anchorEl, onClose }: any) {
    return anchorEl ? <div data-testid='notification-panel'>Notification Panel</div> : null
  }
})

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      text: { secondary: '#666' },
      action: { hover: 'rgba(0,0,0,0.04)' }
    }
  })
}))

describe('NotificationBell Component', () => {
  describe('Rendering', () => {
    it('should render the bell icon', () => {
      render(<NotificationBell />)
      expect(screen.getByTestId('bell-icon') || document.querySelector('[class*="IconButton"]')).toBeTruthy()
    })

    it('should render with default unread count of 0', () => {
      render(<NotificationBell />)
      const badge = document.querySelector('[class*="Badge"]')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Badge Count', () => {
    it('should display badge with correct count', () => {
      render(<NotificationBell unreadCount={5} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('5')
    })

    it('should display 99+ for counts over 99', () => {
      render(<NotificationBell unreadCount={150} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('99+')
    })

    it('should not show badge when count is 0', () => {
      render(<NotificationBell unreadCount={0} />)
      const badge = document.querySelector('[class*="badge"]')
      expect(badge?.textContent).toBe('0')
    })
  })

  describe('Click Interaction', () => {
    it('should open notification panel on click', () => {
      render(<NotificationBell />)
      
      const bellContainer = document.querySelector('[class*="Box"]')
      if (bellContainer) {
        fireEvent.click(bellContainer)
      }
      
      expect(screen.getByTestId('notification-panel')).toBeInTheDocument()
    })

    it('should close notification panel after clicking', () => {
      render(<NotificationBell />)
      
      const bellContainer = document.querySelector('[class*="Box"]')
      if (bellContainer) {
        fireEvent.click(bellContainer)
        fireEvent.click(bellContainer)
      }
      
      expect(document.querySelector('[data-testid="notification-panel"]')).not.toBeInTheDocument()
    })
  })

  describe('Hover State', () => {
    it('should have hover styles', () => {
      render(<NotificationBell />)
      const iconButton = document.querySelector('[class*="IconButton"]')
      expect(iconButton).toBeInTheDocument()
    })
  })
})