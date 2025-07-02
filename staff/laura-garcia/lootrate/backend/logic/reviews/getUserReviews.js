import { data } from '../../data/index.js'
import { validator } from 'common'

const { reviews: Review } = data

const getUserReviews = async (userId, page = 1, limit = 10) => {
  validator.validateId(userId, 'userId')
  validator.validateNumber(page, 'page', 1)
  validator.validateNumber(limit, 'limit', 1, 50)

  const skip = (page - 1) * limit
  
  const reviews = await Review.find({ author: userId })
    .populate('game', 'title rawgId')
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))

  const total = await Review.countDocuments({ author: userId })
  
  return { reviews, total }
}

export { getUserReviews }