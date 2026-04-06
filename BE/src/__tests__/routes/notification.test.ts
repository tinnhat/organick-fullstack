import request from 'supertest'
import express from 'express'

jest.mock('../../services/notificationService', () => ({
  notificationService: {
    createNotification: jest.fn(),
    getUserNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn()
  }
}))

jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
}))

const mockNotificationService = require('../../services/notificationService').notificationService

const createApp = () => {
  const app = express()
  app.use(express.json())
  
  app.post('/api/notifications', async (req, res) => {
    try {
      const { userId, type, title, message, data } = req.body
      const result = await mockNotificationService.createNotification(userId, type, title, message, data)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.get('/api/notifications', async (req, res) => {
    try {
      const { userId, page, limit } = req.query
      const result = await mockNotificationService.getUserNotifications(userId, page || 1, limit || 20)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.put('/api/notifications/:id/read', async (req, res) => {
    try {
      const { userId } = req.body
      const result = await mockNotificationService.markAsRead(req.params.id, userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.put('/api/notifications/read-all', async (req, res) => {
    try {
      const { userId } = req.body
      const result = await mockNotificationService.markAllAsRead(userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  app.delete('/api/notifications/:id', async (req, res) => {
    try {
      const { userId } = req.body
      const result = await mockNotificationService.deleteNotification(req.params.id, userId)
      res.json(result)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return app
}

describe('Notification API Routes', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    app = createApp()
  })

  describe('POST /api/notifications', () => {
    it('should create a notification', async () => {
      const notificationData = {
        userId: 'user123',
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order is on the way',
        data: { orderId: 'order123' }
      }

      mockNotificationService.createNotification.mockResolvedValue({
        data: { _id: 'notif123', ...notificationData }
      })

      const response = await request(app)
        .post('/api/notifications')
        .send(notificationData)
        .expect(201)

      expect(response.body.data.title).toBe('Order Shipped')
    })
  })

  describe('GET /api/notifications', () => {
    it('should return user notifications', async () => {
      mockNotificationService.getUserNotifications.mockResolvedValue({
        data: {
          notifications: [
            { _id: 'n1', title: 'Notification 1', isRead: false },
            { _id: 'n2', title: 'Notification 2', isRead: true }
          ],
          pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
          unreadCount: 1
        }
      })

      const response = await request(app)
        .get('/api/notifications')
        .query({ userId: 'user123' })
        .expect(200)

      expect(response.body.data.notifications).toHaveLength(2)
      expect(response.body.data.unreadCount).toBe(1)
    })
  })

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      mockNotificationService.markAsRead.mockResolvedValue({
        data: { _id: 'notif123', isRead: true }
      })

      const response = await request(app)
        .put('/api/notifications/notif123/read')
        .send({ userId: 'user123' })
        .expect(200)

      expect(response.body.data.isRead).toBe(true)
    })

    it('should return error for non-existent notification', async () => {
      mockNotificationService.markAsRead.mockRejectedValue({
        statusCode: 404,
        message: 'Notification not found'
      })

      await request(app)
        .put('/api/notifications/nonexistent/read')
        .send({ userId: 'user123' })
        .expect(404)
    })
  })

  describe('PUT /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      mockNotificationService.markAllAsRead.mockResolvedValue({
        data: { message: 'All notifications marked as read', modifiedCount: 5 }
      })

      const response = await request(app)
        .put('/api/notifications/read-all')
        .send({ userId: 'user123' })
        .expect(200)

      expect(response.body.data.modifiedCount).toBe(5)
    })
  })

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      mockNotificationService.deleteNotification.mockResolvedValue({
        data: { message: 'Notification deleted successfully' }
      })

      await request(app)
        .delete('/api/notifications/notif123')
        .send({ userId: 'user123' })
        .expect(200)
    })

    it('should return error when trying to delete others notification', async () => {
      mockNotificationService.deleteNotification.mockRejectedValue({
        statusCode: 403,
        message: 'You can only delete your own notifications'
      })

      await request(app)
        .delete('/api/notifications/notif123')
        .send({ userId: 'differentUser' })
        .expect(403)
    })
  })
})