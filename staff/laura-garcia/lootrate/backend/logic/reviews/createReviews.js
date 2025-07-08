import { data } from '../../data/index.js'
import { errors, validator } from 'common'

const { DuplicityError, ValidationError } = errors
const { reviews: Review } = data

const createReview = async (userId, gameId, content, rating) => {
  try {
    validator.validateId(userId, 'userId')
    validator.validateGameId(gameId, 'gameId')
    validator.validateText(content, 'content', 10, 1000)
    validator.validateNumber(rating, 'rating', 1, 5) 
  } catch (error) {
    throw new ValidationError(error.message)
  }

  try {
    const numericGameId = Number(gameId)
    
    const existingReview = await Review.findOne({
      author: userId,
      game: numericGameId
    })

    if (existingReview) {
      throw new DuplicityError('User has already reviewed this game')
    }

    const review = new Review({
      author: userId,
      game: numericGameId,
      content: content.trim(),
      rating
    })

    await review.save()

    await review.populate('author', 'username avatar')
    await review.populate('game', 'name cover')

    return review
  } catch (error) {
    if (error instanceof DuplicityError) {
      throw error
    }
    
    if (error.code === 11000) {
      throw new DuplicityError('User has already reviewed this game')
    }

    throw error
  }
}

export { createReview }