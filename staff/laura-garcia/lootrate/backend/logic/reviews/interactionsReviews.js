import { data } from '../../data/index.js'
import { errors, validator } from 'common'

const { NotFoundError } = errors
const { reviews: Review } = data 

const toggleLike = async (reviewId, userId) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  const hasLiked = review.likes.includes(userId)

  if (hasLiked) {
    review.likes = review.likes.filter(id => id.toString() !== userId)
  } else {
    review.likes.push(userId)
  }

  await review.save()
  
  return { liked: !hasLiked, likesCount: review.likes.length }
}

const toggleHelpful = async (reviewId, userId) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  const hasMarkedHelpful = review.helpful.includes(userId)

  if (hasMarkedHelpful) {
    review.helpful = review.helpful.filter(id => id.toString() !== userId)
  } else {
    review.helpful.push(userId)
  }

  await review.save()
  
  return { helpful: !hasMarkedHelpful, helpfulCount: review.helpful.length }
}

export {
  toggleLike,
  toggleHelpful
}