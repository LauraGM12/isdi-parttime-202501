import { data } from '../../data/index.js'
import { errors } from 'common'
import { validator } from 'common'

const { ValidationError, DuplicityError } = errors
const { validateId, validateText, validateNumber } = validator
const { reviews: Review } = data

const createReview = async (userId, gameId, content, rating) => {
  try {
    validateId(userId, 'userId')
  } catch (error) {
    throw new ValidationError('Invalid user ID')
  }

  try {
    validateId(gameId, 'gameId')
  } catch (error) {
    throw new ValidationError('Invalid game ID')
  }

  try {
    validateText(content, 'content', 10, 1000)
  } catch (error) {
    throw new ValidationError('Content must be at least 10 characters long')
  }

  try {
    validateNumber(rating, 'rating', 1, 10)
  } catch (error) {
    throw new ValidationError('Rating must be a number between 1 and 10')
  }

  const existingReview = await Review.findOne({
    author: userId,
    game: gameId
  })

  if (existingReview) {
    throw new DuplicityError('User has already reviewed this game')
  }

  try {
    const review = new Review({
      author: userId,
      game: gameId,
      content: content.trim(),
      rating
    })

    await review.save()
    await review.populate('author', 'username avatar')
    await review.populate('game', 'name cover')

    const reviewObj = review.toObject()
    reviewObj.id = reviewObj._id

    return reviewObj
  } catch (error) {
    if (error.code === 11000) {
      throw new DuplicityError('User has already reviewed this game')
    }
    throw error
  }
}

export { createReview }