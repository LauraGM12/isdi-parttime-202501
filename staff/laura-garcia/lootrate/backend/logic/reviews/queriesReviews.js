import { data } from '../../data/index.js'
import { validator } from 'common'
import { getGameDetails } from '../games/rawgService.js'
import { getUserReviews } from './getUserReviews.js'

const { reviews: Review } = data

const getGameReviews = async (gameId, page = 1, limit = 10, sortBy = 'createdAt') => {
  const skip = (page - 1) * limit
  
  const sortOptions = {
    'createdAt': { createdAt: -1 },
    'rating': { rating: -1 },
    'helpful': { helpfulCount: -1 }
  }
  
  const reviews = await Review.find({ game: gameId })
    .populate('author', 'username avatar')
    .sort(sortOptions[sortBy] || sortOptions.createdAt)
    .skip(skip)
    .limit(parseInt(limit))

  const reviewsWithId = reviews.map(review => {
    const reviewObj = review.toObject()
    reviewObj.id = reviewObj._id
    return reviewObj
  })

  const total = await Review.countDocuments({ game: gameId })
  
  return { reviews: reviewsWithId, total }
}

const getMyReviews = async (userId, page = 1, limit = 10) => {
  const { reviews, total } = await getUserReviews(userId, page, limit)
  
  for (const review of reviews) {
    if (review.game?.rawgId) {
      const gameData = await getGameDetails(review.game.rawgId)
      review.game = { ...review.game.toObject(), ...gameData }
    }
  }
  
  return { reviews, total }
}

export {
  getGameReviews,
  getMyReviews
}