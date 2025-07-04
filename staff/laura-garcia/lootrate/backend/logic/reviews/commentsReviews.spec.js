import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { addComment, getComments, deleteComment } from './commentsReviews.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

jest.mock('../../data/index.js', () => ({
  data: {
    reviews: {
      findById: jest.fn()
    }
  }
}))

const Review = data.reviews

jest.mock('common', () => ({
  errors: {
    NotFoundError: class NotFoundError extends Error {
      constructor(message) {
        super(message)
        this.name = 'NotFoundError'
      }
    },
    AuthorizationError: class AuthorizationError extends Error {
      constructor(message) {
        super(message)
        this.name = 'AuthorizationError'
      }
    }
  }
}))

describe('comments logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addComment', () => {
    it('debería añadir un comentario correctamente', async () => {
      const mockReview = {
        _id: 'reviewId123',
        comments: [],
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(mockReview)

      const result = await addComment('reviewId123', 'userId456', 'Comentario de prueba')

      expect(Review.findById).toHaveBeenCalledWith('reviewId123')
      expect(mockReview.comments).toHaveLength(1)
      expect(mockReview.comments[0].author).toBe('userId456')
      expect(mockReview.comments[0].content).toBe('Comentario de prueba')
      expect(mockReview.save).toHaveBeenCalled()
      expect(mockReview.populate).toHaveBeenCalledWith('comments.author', 'username avatar')
    })

    it('debería lanzar NotFoundError si no encuentra la reseña', async () => {
      Review.findById.mockResolvedValue(null)

      await expect(addComment('badId', 'user', 'texto')).rejects.toThrow(errors.NotFoundError)
      await expect(addComment('badId', 'user', 'texto')).rejects.toThrow('Reseña no encontrada')
    })
  })

  describe('getComments', () => {
    it('debería obtener comentarios paginados correctamente', async () => {
      const reviewMock = {
        _id: 'reviewId123',
        comments: [
          { _id: 'comment1', author: { _id: 'user1', username: 'user1' }, content: 'Comentario 1', createdAt: new Date('2023-01-02') },
          { _id: 'comment2', author: { _id: 'user2', username: 'user2' }, content: 'Comentario 2', createdAt: new Date('2023-01-01') }
        ]
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      const result = await getComments('reviewId123', 1, 10)

      expect(Review.findById).toHaveBeenCalledWith('reviewId123')
      expect(populateMock).toHaveBeenCalledWith('comments.author', 'username avatar')
      expect(result.comments).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.comments[0]._id).toBe('comment1')
    })

    it('debería manejar paginación correctamente', async () => {
      const reviewMock = {
        _id: 'reviewId123',
        comments: [
          { _id: 'comment1', createdAt: new Date('2023-01-03') },
          { _id: 'comment2', createdAt: new Date('2023-01-02') },
          { _id: 'comment3', createdAt: new Date('2023-01-01') }
        ]
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      const result = await getComments('reviewId123', 2, 1)

      expect(result.comments).toHaveLength(1)
      expect(result.comments[0]._id).toBe('comment2')
      expect(result.total).toBe(3)
    })

    it('debería usar valores por defecto para page y limit', async () => {
      const reviewMock = {
        _id: 'reviewId123',
        comments: []
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      await getComments('reviewId123')

      expect(Review.findById).toHaveBeenCalledWith('reviewId123')
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      const populateMock = jest.fn().mockResolvedValue(null)
      Review.findById.mockReturnValue({ populate: populateMock })

      await expect(getComments('badId', 1, 10)).rejects.toThrow(errors.NotFoundError)
      await expect(getComments('badId', 1, 10)).rejects.toThrow('Reseña no encontrada')
    })
  })

  describe('deleteComment', () => {
    it('debería eliminar un comentario si el usuario es autor del comentario', async () => {
      const mockComment = {
        _id: 'commentId456',
        author: 'userId789'
      }

      const reviewMock = {
        _id: 'reviewId123',
        author: { _id: 'otherUser' },
        comments: {
          id: jest.fn().mockReturnValue(mockComment),
          pull: jest.fn()
        },
        save: jest.fn().mockResolvedValue()
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      const result = await deleteComment('reviewId123', 'commentId456', 'userId789')

      expect(reviewMock.comments.id).toHaveBeenCalledWith('commentId456')
      expect(reviewMock.comments.pull).toHaveBeenCalledWith('commentId456')
      expect(reviewMock.save).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('debería eliminar un comentario si el usuario es autor de la reseña', async () => {
      const mockComment = {
        _id: 'commentId456',
        author: 'otherUser'
      }

      const reviewMock = {
        _id: 'reviewId123',
        author: { _id: 'userId789' },
        comments: {
          id: jest.fn().mockReturnValue(mockComment),
          pull: jest.fn()
        },
        save: jest.fn().mockResolvedValue()
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      const result = await deleteComment('reviewId123', 'commentId456', 'userId789')

      expect(result).toBe(true)
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      const populateMock = jest.fn().mockResolvedValue(null)
      Review.findById.mockReturnValue({ populate: populateMock })

      await expect(deleteComment('badId', 'commentId', 'userId')).rejects.toThrow(errors.NotFoundError)
      await expect(deleteComment('badId', 'commentId', 'userId')).rejects.toThrow('Reseña no encontrada')
    })

    it('debería lanzar NotFoundError si el comentario no existe', async () => {
      const reviewMock = {
        _id: 'reviewId123',
        author: { _id: 'otherUser' },
        comments: {
          id: jest.fn().mockReturnValue(null)
        }
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      await expect(deleteComment('reviewId123', 'badCommentId', 'userId')).rejects.toThrow(errors.NotFoundError)
      await expect(deleteComment('reviewId123', 'badCommentId', 'userId')).rejects.toThrow('Comentario no encontrado')
    })

    it('debería lanzar AuthorizationError si el usuario no tiene permiso', async () => {
      const mockComment = {
        _id: 'commentId456',
        author: 'anotherUser'
      }

      const reviewMock = {
        _id: 'reviewId123',
        author: { _id: 'otherUser' },
        comments: {
          id: jest.fn().mockReturnValue(mockComment)
        }
      }

      const populateMock = jest.fn().mockResolvedValue(reviewMock)
      Review.findById.mockReturnValue({ populate: populateMock })

      await expect(deleteComment('reviewId123', 'commentId456', 'userId789')).rejects.toThrow(errors.AuthorizationError)
      await expect(deleteComment('reviewId123', 'commentId456', 'userId789')).rejects.toThrow('No tienes permisos para eliminar este comentario')
    })
  })
})
