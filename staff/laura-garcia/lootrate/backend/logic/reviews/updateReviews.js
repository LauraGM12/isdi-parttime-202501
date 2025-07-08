import { data } from '../../data/index.js'
import { errors, validator } from 'common'

const { NotFoundError, AuthError } = errors  
const { reviews: Review } = data

const updateReview = async (reviewId, userId, updates) => {
  try {
    validator.validateId(reviewId, 'reviewId')
    validator.validateId(userId, 'userId')
  } catch (error) {
    throw new errors.ValidationError(error.message)
  }
  
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  if (review.author.toString() !== userId) {
    throw new AuthError('El usuario no es el autor de esta reseña') 
  }

  Object.assign(review, updates)
  await review.save()
  await review.populate('author', 'username avatar')
  await review.populate('game', 'name cover')

  const reviewObj = review.toObject()
  reviewObj.id = reviewObj._id

  return reviewObj
}

export { updateReview }