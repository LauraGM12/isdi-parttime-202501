import { data } from '../../data/index.js'
import { errors } from 'common'

const { DuplicityError } = errors
const { reviews: Review } = data

const createReview = async (userId, gameId, content, rating) => {
  const review = new Review({
    author: userId,
    game: gameId,
    content,
    rating
  })

  await review.save()
  await review.populate('author', 'username avatar')
  await review.populate('game', 'name cover')

  return review
}

export { createReview }