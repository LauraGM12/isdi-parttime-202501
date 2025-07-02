import { Router, json } from "express"
import extractId from "../../middlewares/extractId.js"
import * as handlers from "./handlers/index.js"

const jsonBodyParser = json()
const reviewsRouter = Router()

reviewsRouter.post('/', jsonBodyParser, extractId, handlers.createReview) 
reviewsRouter.get('/user/:userId', handlers.getUserReviews) 
reviewsRouter.get('/game/:gameId', handlers.getGameReviews) 
reviewsRouter.put('/:reviewId', jsonBodyParser, extractId, handlers.updateReview) /
reviewsRouter.delete('/:reviewId', extractId, handlers.deleteReview) 
reviewsRouter.post('/:reviewId/like', extractId, handlers.toggleLike) 
reviewsRouter.post('/:reviewId/helpful', extractId, handlers.toggleHelpful) 
reviewsRouter.post('/:reviewId/comments', jsonBodyParser, extractId, handlers.addComment) 
reviewsRouter.get('/:reviewId/comments', handlers.getComments) 
reviewsRouter.delete('/:reviewId/comments/:commentId', extractId, handlers.deleteComment)

export default reviewsRouter