import { data } from '../../data/index.js'
import { errors, validator } from 'common'

const { NotFoundError, AuthError } = errors
const { reviews: Review } = data

const deleteReview = async (reviewId, userId) => {
  validator.validateId(reviewId, 'reviewId')
  validator.validateId(userId, 'userId')
  
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  if (review.author.toString() !== userId) {
    throw new AuthError('El usuario no es el autor de esta reseña')
  }

  await Review.findByIdAndDelete(reviewId)
  return true
}

export { deleteReview }