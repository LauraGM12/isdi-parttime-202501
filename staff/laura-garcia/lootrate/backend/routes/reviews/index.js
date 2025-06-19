import { Router, json } from "express"
import extractId from "../../middlewares/extractId.js"
import handlers from "./handlers/index.js"

// Parser para JSON
const jsonBodyParser = json()

// Router para las rutas de reviews
const reviewsRouter = Router()

// Rutas de reviews
reviewsRouter.post('/', jsonBodyParser, extractId, handlers.createReview) // Crear reseña
reviewsRouter.get('/game/:gameId', handlers.getGameReviews) // Obtener reseñas de un juego
reviewsRouter.get('/user/:userId', handlers.getUserReviews) // Obtener reseñas de un usuario
reviewsRouter.get('/own', extractId, handlers.getOwnReviews) // Obtener reseñas propias
reviewsRouter.put('/:reviewId', jsonBodyParser, extractId, handlers.updateReview) // Actualizar reseña
reviewsRouter.delete('/:reviewId', extractId, handlers.deleteReview) // Eliminar reseña
reviewsRouter.post('/:reviewId/like', extractId, handlers.toggleLike) // Dar/quitar like
reviewsRouter.post('/:reviewId/helpful', extractId, handlers.toggleHelpful) // Marcar como útil

export default reviewsRouter