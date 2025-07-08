import { data } from '../../data/index.js'
import { validator } from 'common'
import { getGameDetails } from '../games/rawgService.js'

const { reviews: Review } = data

const getUserReviews = async (userId, page = 1, limit = 10) => {
  validator.validateId(userId, 'userId')
  validator.validateNumber(page, 'page', 1)
  validator.validateNumber(limit, 'limit', 1, 50)
  
  const skip = (page - 1) * limit
  
  const reviews = await Review.find({ author: userId })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
  
  const reviewsWithDetails = await Promise.all(reviews.map(async review => {
    const reviewObj = review.toObject()
    reviewObj.id = reviewObj._id
    
    if (reviewObj.game) {
      try {
        const gameData = await getGameDetails(reviewObj.game)
        reviewObj.game = { 
          id: reviewObj.game, 
          name: gameData.name || 'Juego desconocido',
          rawgId: reviewObj.game
        }
      } catch (error) {
        console.error(`Error al obtener detalles del juego ${reviewObj.game}:`, error)
        reviewObj.game = {
          id: reviewObj.game,
          name: 'Juego desconocido',
          rawgId: reviewObj.game
        }
      }
    }
    
    return reviewObj
  }))
  
  const total = await Review.countDocuments({ author: userId })
  
  return { reviews: reviewsWithDetails, total }
}

export { getUserReviews }