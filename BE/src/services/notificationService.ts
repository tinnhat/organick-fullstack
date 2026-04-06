// ============ FEATURE: notifications START ============
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { notificationModel } from '../models/notificationModel'
import ApiError from '../utils/ApiError'
import { responseData } from '../utils/algorithms'
/* eslint-disable no-useless-catch */

let io: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  io = require('../config/socket').io
} catch (error) {
  console.warn('Socket.io not initialized yet')
}

const createNotification = async (
  userId: string,
  type: 'order' | 'chat' | 'review',
  title: string,
  message: string,
  data?: any
) => {
  try {
    const notification = {
      userId: new ObjectId(userId),
      type,
      title,
      message,
      data: data || {},
      isRead: false
    }
    const created = await notificationModel.createNew(notification)
    const getNotification = await notificationModel.findOneById(created.insertedId.toString())

    if (getNotification) {
      emitRealtimeNotification(userId, getNotification)
    }

    return created
  } catch (error) {
    throw error
  }
}

const getUserNotifications = async (userId: string, page: number = 1, limit: number = 20) => {
  try {
    const notifications = await notificationModel.getUserNotifications(userId, page, limit)
    const total = await notificationModel.countUserNotifications(userId)
    const unreadCount = await notificationModel.countUnreadNotifications(userId)
    return responseData({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      unreadCount
    })
  } catch (error) {
    throw error
  }
}

const markAsRead = async (id: string, userId: string) => {
  try {
    const notification = await notificationModel.findOneById(id)
    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
    }

    if (notification.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only mark your own notifications as read')
    }

    const result = await notificationModel.findAndUpdate(id, { isRead: true })
    return responseData(result)
  } catch (error) {
    throw error
  }
}

const markAllAsRead = async (userId: string) => {
  try {
    const result = await notificationModel.markAllAsRead(userId)
    return responseData({ message: 'All notifications marked as read', modifiedCount: result.modifiedCount })
  } catch (error) {
    throw error
  }
}

const deleteNotification = async (id: string, userId: string) => {
  try {
    const notification = await notificationModel.findOneById(id)
    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
    }

    if (notification.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only delete your own notifications')
    }

    await notificationModel.findAndRemove(id)
    return responseData({ message: 'Notification deleted successfully' })
  } catch (error) {
    throw error
  }
}

const emitRealtimeNotification = (userId: string, notification: any) => {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notification)
  }
}

export const notificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  emitRealtimeNotification
}
// ============ FEATURE: notifications END ============
