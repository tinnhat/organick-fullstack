// ============ FEATURE: notifications START ============
import express from 'express'
import { Auth } from '../../middlewares/authMiddleware'
import { notificationController } from '../../controllers/notificationController'

const Router = express.Router()

Router.get('/', Auth, notificationController.getUserNotifications)

Router.put('/read/:id', Auth, notificationController.markAsRead)

Router.put('/read-all', Auth, notificationController.markAllAsRead)

Router.delete('/:id', Auth, notificationController.deleteNotification)

export const notificationRoute = Router
// ============ FEATURE: notifications END ============
