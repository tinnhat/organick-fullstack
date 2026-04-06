import { renderHook, act } from '@testing-library/react'
import { useChat } from '../../../hooks/useChat'

jest.mock('../../../hooks/useSocket', () => ({
  useSocket: () => ({
    socket: { emit: jest.fn(), on: jest.fn() },
    connected: true
  })
}))

const mockEmit = jest.fn()
const mockOn = jest.fn()

jest.mock('../../../hooks/useSocket', () => ({
  useSocket: () => ({
    socket: { emit: mockEmit, on: mockOn },
    connected: true
  })
}))

describe('useChat Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Send Message', () => {
    it('should send a message via socket', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.sendMessage('Hello')
      })

      expect(mockEmit).toHaveBeenCalledWith(
        'send_message',
        expect.objectContaining({
          content: 'Hello'
        })
      )
    })

    it('should not send empty messages', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.sendMessage('')
      })

      expect(mockEmit).not.toHaveBeenCalled()
    })

    it('should not send whitespace-only messages', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.sendMessage('   ')
      })

      expect(mockEmit).not.toHaveBeenCalled()
    })
  })

  describe('Messages State', () => {
    it('should add message to messages array when received', () => {
      const messages = [
        { _id: 'm1', senderId: 'user1', content: 'Hello', timestamp: new Date() }
      ]
      
      mockOn.mockImplementation((event, callback) => {
        if (event === 'receive_message') {
          callback(messages[0])
        }
      })

      const { result } = renderHook(() => useChat('admin'))

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.messages[0].content).toBe('Hello')
    })
  })

  describe('Typing Indicator', () => {
    it('should set typing state when typing', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.setTyping(true)
      })

      expect(result.current.isTyping).toBe(true)
    })

    it('should clear typing state', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.setTyping(true)
      })

      act(() => {
        result.current.setTyping(false)
      })

      expect(result.current.isTyping).toBe(false)
    })
  })

  describe('Mark as Read', () => {
    it('should emit mark_as_read event', () => {
      const { result } = renderHook(() => useChat('admin'))

      act(() => {
        result.current.markAsRead()
      })

      expect(mockEmit).toHaveBeenCalledWith('mark_as_read', expect.any(Object))
    })
  })

  describe('Connection Status', () => {
    it('should report connected status', () => {
      const { result } = renderHook(() => useChat('admin'))

      expect(result.current.isConnected).toBe(true)
    })

    it('should report disconnected status when socket not connected', () => {
      jest.doMock('../../../hooks/useSocket', () => ({
        useSocket: () => ({
          socket: { emit: jest.fn(), on: jest.fn() },
          connected: false
        })
      }))

      const { result } = renderHook(() => useChat('admin'))

      expect(result.current.isConnected).toBe(false)
    })
  })
})