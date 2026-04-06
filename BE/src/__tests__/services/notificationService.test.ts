import { notificationModel } from '../../models/notificationModel'
import ApiError from '../../utils/ApiError'
import { responseData } from '../../utils/algorithms'

jest.mock('../../models/notificationModel')
jest.mock('../../utils/algorithms')

const mockNotificationModel = notificationModel as jest.Mock
const mockResponseData = responseData as jest.Mock

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResponseData.mockImplementation((data) => ({ data }))
  })

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const notificationData = {
        userId: 'user123',
        type: 'order' as const,
        title: 'Order Shipped',
        message: 'Your order is on the way',
        data: { orderId: 'order123' }
      }

      mockNotificationModel.createNew.mockResolvedValue({ insertedId: 'notif123' })
      mockNotificationModel.findOneById.mockResolvedValue({
        _id: 'notif123',
        ...notificationData,
        isRead: false
      })

      const { createNotification } = require('../../services/notificationService')
      const result = await createNotification(
        notificationData.userId,
        notificationData.type,
        notificationData.title,
        notificationData.message,
        notificationData.data
      )

      expect(mockNotificationModel.createNew).toHaveBeenCalledWith(expect.objectContaining({
        userId: expect.anything(),
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order is on the way'
      }))
      expect(result.insertedId).toBe('notif123')
    })

    it('should create notification with default data empty object', async () => {
      mockNotificationModel.createNew.mockResolvedValue({ insertedId: 'notif123' })
      mockNotificationModel.findOneById.mockResolvedValue({
        _id: 'notif123',
        userId: 'user123',
        type: 'chat',
        title: 'New Message',
        message: 'You have a new message',
        data: {},
        isRead: false
      })

      const { createNotification } = require('../../services/notificationService')
      await createNotification('user123', 'chat', 'New Message', 'You have a new message')

      expect(mockNotificationModel.createNew).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }))
    })
  })

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      const notifications = [
        { _id: 'n1', title: 'Notification 1', isRead: false },
        { _id: 'n2', title: 'Notification 2', isRead: true }
      ]

      mockNotificationModel.getUserNotifications.mockResolvedValue(notifications)
      mockNotificationModel.countUserNotifications.mockResolvedValue(50)
      mockNotificationModel.countUnreadNotifications.mockResolvedValue(5)

      const { getUserNotifications } = require('../../services/notificationService')
      const result = await getUserNotifications('user123', 1, 20)

      expect(result.data.notifications).toHaveLength(2)
      expect(result.data.pagination.total).toBe(50)
      expect(result.data.unreadCount).toBe(5)
      expect(result.data.pagination.page).toBe(1)
      expect(result.data.pagination.limit).toBe(20)
      expect(result.data.pagination.totalPages).toBe(3)
    })

    it('should return empty array when no notifications', async () => {
      mockNotificationModel.getUserNotifications.mockResolvedValue([])
      mockNotificationModel.countUserNotifications.mockResolvedValue(0)
      mockNotificationModel.countUnreadNotifications.mockResolvedValue(0)

      const { getUserNotifications } = require('../../services/notificationService')
      const result = await getUserNotifications('user123', 1, 20)

      expect(result.data.notifications).toHaveLength(0)
      expect(result.data.pagination.total).toBe(0)
      expect(result.data.unreadCount).toBe(0)
    })
  })

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notification = {
        _id: 'notif123',
        userId: 'user123',
        isRead: false
      }

      mockNotificationModel.findOneById.mockResolvedValue(notification)
      mockNotificationModel.findAndUpdate.mockResolvedValue({ ...notification, isRead: true })

      const { markAsRead } = require('../../services/notificationService')
      const result = await markAsRead('notif123', 'user123')

      expect(mockNotificationModel.findAndUpdate).toHaveBeenCalledWith('notif123', { isRead: true })
      expect(result.data.isRead).toBe(true)
    })

    it('should throw error when notification not found', async () => {
      mockNotificationModel.findOneById.mockResolvedValue(null)

      const { markAsRead } = require('../../services/notificationService')
      
      await expect(markAsRead('notif123', 'user123')).rejects.toThrow('Notification not found')
    })

    it('should throw error when user tries to mark others notification as read', async () => {
      const notification = {
        _id: 'notif123',
        userId: 'differentUser',
        isRead: false
      }

      mockNotificationModel.findOneById.mockResolvedValue(notification)

      const { markAsRead } = require('../../services/notificationService')
      
      await expect(markAsRead('notif123', 'user123')).rejects.toThrow('You can only mark your own notifications as read')
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      mockNotificationModel.markAllAsRead.mockResolvedValue({ modifiedCount: 5 })

      const { markAllAsRead } = require('../../services/notificationService')
      const result = await markAllAsRead('user123')

      expect(mockNotificationModel.markAllAsRead).toHaveBeenCalledWith('user123')
      expect(result.data.modifiedCount).toBe(5)
      expect(result.data.message).toBe('All notifications marked as read')
    })

    it('should return modifiedCount 0 when no unread notifications', async () => {
      mockNotificationModel.markAllAsRead.mockResolvedValue({ modifiedCount: 0 })

      const { markAllAsRead } = require('../../services/notificationService')
      const result = await markAllAsRead('user123')

      expect(result.data.modifiedCount).toBe(0)
    })
  })
})