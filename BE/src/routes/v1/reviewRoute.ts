// ============ FEATURE: reviews START ============
import express from 'express'
import { Auth } from '../../middlewares/authMiddleware'
import { reviewValidation } from '../../validations/reviewValidation'
import { reviewController } from '../../controllers/reviewController'

const Router = express.Router()

Router.post('/', Auth, reviewValidation.createNew, reviewController.createNew)

Router.put('/:id', Auth, reviewValidation.updateReview, reviewController.updateReview)

Router.delete('/:id', Auth, reviewValidation.validateReviewId, reviewController.deleteReview)

Router.get('/product/:productId', reviewValidation.validateProductReviews, reviewController.getProductReviews)

Router.get('/product/:productId/average', reviewController.getProductAverageRating)

Router.get('/product/:productId/can-review', Auth, reviewController.canUserReviewProduct)

export const reviewRoute = Router
// ============ FEATURE: reviews END ============
