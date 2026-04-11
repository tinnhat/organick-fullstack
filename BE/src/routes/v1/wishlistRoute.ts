import express from 'express'
import { wishlistController } from '../../controllers/wishlistController'
import { Auth } from '../../middlewares/authMiddleware'

const Router = express.Router()

Router.get('/', Auth, wishlistController.getWishlist)

Router.post('/', Auth, wishlistController.addToWishlist)

Router.post('/toggle', Auth, wishlistController.toggleWishlist)

Router.delete('/:productId', Auth, wishlistController.removeFromWishlist)

export const wishlistRoute = Router