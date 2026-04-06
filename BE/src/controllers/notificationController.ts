// ============ FEATURE: notifications START ============
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { notificationService } from '../services/notificationService'

const getUserNotifications = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const notifications = await notificationService.getUserNotifications(userId, page, limit)
    res.status(StatusCodes.OK).json(notifications)
  } catch (error) {
    next(error)
  }
}

const markAsRead = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await notificationService.markAsRead(req.params.id, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const markAllAsRead = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await notificationService.markAllAsRead(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteNotification = async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user._id.toString()
    const result = await notificationService.deleteNotification(req.params.id, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const notificationController = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
}
// ============ FEATURE: notifications END ============
