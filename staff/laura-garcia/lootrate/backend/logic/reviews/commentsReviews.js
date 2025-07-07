import { data } from '../../data/index.js'
import { errors } from 'common'

const { NotFoundError, AuthError } = errors
const { reviews: Review } = data

const addComment = async (reviewId, userId, content) => {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  const comment = {
    author: userId,
    content,
    createdAt: new Date()
  }

  review.comments.push(comment)
  await review.save()
  await review.populate('comments.author', 'username avatar')
  
  return review.comments[review.comments.length - 1]
}

const getComments = async (reviewId, page = 1, limit = 10) => {
  const review = await Review.findById(reviewId)
    .populate('comments.author', 'username avatar')
  
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  const skip = (page - 1) * limit
  const comments = review.comments
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + limit)

  return { 
    comments, 
    total: review.comments.length 
  }
}

const deleteComment = async (reviewId, commentId, userId) => {
  const review = await Review.findById(reviewId).populate('author')
  if (!review) {
    throw new NotFoundError('Reseña no encontrada')
  }

  const comment = review.comments.id(commentId)
  if (!comment) {
    throw new NotFoundError('Comentario no encontrado')
  }

  const isCommentAuthor = comment.author.toString() === userId
  const isReviewAuthor = review.author._id.toString() === userId
  
  if (!isCommentAuthor && !isReviewAuthor) {
    throw new AuthError('No tienes permisos para eliminar este comentario')
  }

  review.comments.pull(commentId)
  await review.save()
  return true
}

export {
  addComment,
  getComments,
  deleteComment
}