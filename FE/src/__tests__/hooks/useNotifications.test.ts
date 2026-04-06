import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '../../../hooks/useNotifications'

global.fetch = jest.fn()

describe('useNotifications Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('Fetching Notifications', () => {
    it('should fetch notifications on mount', async () => {
      const mockNotifications = [
        { _id: 'n1', title: 'Notification 1', isRead: false },
        { _id: 'n2', title: 'Notification 2', isRead: true }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            notifications: mockNotifications,
            unreadCount: 1
          }
        })
      })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications'),
        expect.any(Object)
      )
    })

    it('should return notifications data', async () => {
      const mockNotifications = [
        { _id: 'n1', title: 'Notification 1', isRead: false }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            notifications: mockNotifications,
            unreadCount: 1
          }
        })
      })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.notifications).toEqual(mockNotifications)
    })

    it('should return unread count', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            notifications: [],
            unreadCount: 5
          }
        })
      })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.unreadCount).toBe(5)
    })
  })

  describe('Mark as Read', () => {
    it('should call API to mark notification as read', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { notifications: [], unreadCount: 0 } })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { success: true } })
        })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      await act(async () => {
        await result.current.markAsRead('notif123')
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/notif123/read'),
        expect.objectContaining({ method: 'PUT' })
      )
    })

    it('should update local state after marking as read', async () => {
      const notifications = [
        { _id: 'n1', title: 'Notification 1', isRead: false },
        { _id: 'n2', title: 'Notification 2', isRead: false }
      ]

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { notifications, unreadCount: 2 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { notifications: [{ ...notifications[0], isRead: true }], unreadCount: 1 }
          })
        })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      await act(async () => {
        await result.current.markAsRead('n1')
      })

      expect(result.current.unreadCount).toBe(1)
    })
  })

  describe('Mark All as Read', () => {
    it('should call API to mark all notifications as read', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { notifications: [], unreadCount: 0 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            data: { message: 'All notifications marked as read', modifiedCount: 5 }
          })
        })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      await act(async () => {
        await result.current.markAllAsRead()
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/read-all'),
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch error gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.error).toBeTruthy()
    })

    it('should set error state when API fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.error).toBeTruthy()
    })
  })

  describe('Loading State', () => {
    it('should be loading initially', () => {
      ;(global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ data: { notifications: [], unreadCount: 0 } })
        }), 1000))
      )

      const { result } = renderHook(() => useNotifications())

      expect(result.current.isLoading).toBe(true)
    })

    it('should not be loading after data is fetched', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: { notifications: [], unreadCount: 0 }
        })
      })

      const { result } = renderHook(() => useNotifications())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      expect(result.current.isLoading).toBe(false)
    })
  })
})