import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { deleteReview } from './deleteReviews.js'
import { data } from '../../data/index.js'
import { errors, validator } from 'common'

jest.mock('../../data/index.js', () => ({
  data: {
    reviews: {
      findById: jest.fn(),
      findByIdAndDelete: jest.fn()
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
  },
  validator: {
    validateId: jest.fn()
  }
}))

describe('deleteReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería eliminar la reseña correctamente', async () => {
    const mockReview = {
      _id: 'reviewId123',
      author: 'userId456'
    }

    validator.validateId.mockReturnValue(true)
    Review.findById.mockResolvedValue(mockReview)
    Review.findByIdAndDelete.mockResolvedValue()

    const result = await deleteReview('reviewId123', 'userId456')

    expect(validator.validateId).toHaveBeenCalledWith('reviewId123', 'reviewId')
    expect(validator.validateId).toHaveBeenCalledWith('userId456', 'userId')
    expect(Review.findById).toHaveBeenCalledWith('reviewId123')
    expect(Review.findByIdAndDelete).toHaveBeenCalledWith('reviewId123')
    expect(result).toBe(true)
  })

  it('debería lanzar NotFoundError si no encuentra la reseña', async () => {
    validator.validateId.mockReturnValue(true)
    Review.findById.mockResolvedValue(null)

    await expect(deleteReview('invalidId', 'userId456')).rejects.toThrow(errors.NotFoundError)
    await expect(deleteReview('invalidId', 'userId456')).rejects.toThrow('Reseña no encontrada')
  })

  it('debería lanzar AuthorizationError si el usuario no es el autor', async () => {
    const mockReview = {
      _id: 'reviewId123',
      author: 'otherUserId'
    }

    validator.validateId.mockReturnValue(true)
    Review.findById.mockResolvedValue(mockReview)

    await expect(deleteReview('reviewId123', 'userId456')).rejects.toThrow(errors.AuthorizationError)
    await expect(deleteReview('reviewId123', 'userId456')).rejects.toThrow('El usuario no es el autor de esta reseña')
  })

  it('debería manejar author como ObjectId', async () => {
    const mockReview = {
      _id: 'reviewId123',
      author: { toString: () => 'userId456' }
    }

    validator.validateId.mockReturnValue(true)
    Review.findById.mockResolvedValue(mockReview)
    Review.findByIdAndDelete.mockResolvedValue()

    const result = await deleteReview('reviewId123', 'userId456')

    expect(result).toBe(true)
  })
})
