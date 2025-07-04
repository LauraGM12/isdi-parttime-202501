import { describe, it, expect, jest, beforeEach } from '@jest/globals'

jest.mock('../../data/index.js', () => ({
  data: {
    reviews: {
      findById: jest.fn()
    }
  }
}))

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
    },
    ValidationError: class ValidationError extends Error {
      constructor(message) {
        super(message)
        this.name = 'ValidationError'
      }
    },
    FormatError: class FormatError extends Error {
      constructor(message) {
        super(message)
        this.name = 'FormatError'
      }
    }
  },
  validator: {
    validateId: jest.fn()
  }
}))

import { updateReview } from './updateReviews.js'
import { data } from '../../data/index.js'
import { errors, validator } from 'common'

const Review = data.reviews

describe('updateReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    validator.validateId.mockImplementation(() => {})
  })

  it('debería actualizar la reseña correctamente si el usuario es el autor', async () => {
    const populateMock = jest.fn().mockReturnThis()
    const saveMock = jest.fn().mockResolvedValue()

    const reviewMock = {
      author: { toString: () => 'user123' },
      save: saveMock,
      populate: populateMock,
      content: 'contenido original',
      rating: 3
    }

    Review.findById.mockResolvedValue(reviewMock)

    const updates = { content: 'Nuevo contenido', rating: 4 }
    const result = await updateReview('507f1f77bcf86cd799439011', 'user123', updates)

    expect(validator.validateId).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'reviewId')
    expect(validator.validateId).toHaveBeenCalledWith('user123', 'userId')
    expect(Review.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
    expect(reviewMock.content).toBe('Nuevo contenido')
    expect(reviewMock.rating).toBe(4)
    expect(saveMock).toHaveBeenCalled()
    expect(populateMock).toHaveBeenCalledWith('author', 'username avatar')
    expect(populateMock).toHaveBeenCalledWith('game', 'name cover')
    expect(result).toBe(reviewMock)
  })

  it('debería lanzar ValidationError si reviewId es inválido', async () => {
    validator.validateId.mockImplementation((id, field) => {
      if (field === 'reviewId') {
        throw new errors.FormatError('formato de reviewId inválido')
      }
    })

    await expect(updateReview('invalid', 'user123', {}))
      .rejects.toThrow(errors.ValidationError)
    await expect(updateReview('invalid', 'user123', {}))
      .rejects.toThrow('formato de reviewId inválido')
  })

  it('debería lanzar ValidationError si userId es inválido', async () => {
    validator.validateId.mockImplementation((id, field) => {
      if (field === 'userId') {
        throw new errors.FormatError('formato de userId inválido')
      }
    })

    await expect(updateReview('507f1f77bcf86cd799439011', 'invalid', {}))
      .rejects.toThrow(errors.ValidationError)
    await expect(updateReview('507f1f77bcf86cd799439011', 'invalid', {}))
      .rejects.toThrow('formato de userId inválido')
  })

  it('debería lanzar NotFoundError si la reseña no existe', async () => {
    Review.findById.mockResolvedValue(null)

    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', {}))
      .rejects.toThrow(errors.NotFoundError)
    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', {}))
      .rejects.toThrow('Reseña no encontrada')
  })

  it('debería lanzar AuthorizationError si el usuario no es el autor', async () => {
    const reviewMock = {
      author: { toString: () => 'otherUser' }
    }

    Review.findById.mockResolvedValue(reviewMock)

    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', {}))
      .rejects.toThrow(errors.AuthorizationError)
    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', {}))
      .rejects.toThrow('El usuario no es el autor de esta reseña')
  })

  it('debería manejar errores en save()', async () => {
    const saveMock = jest.fn().mockRejectedValue(new Error('Error de guardado'))
    const populateMock = jest.fn().mockReturnThis()

    const reviewMock = {
      author: { toString: () => 'user123' },
      save: saveMock,
      populate: populateMock
    }

    Review.findById.mockResolvedValue(reviewMock)

    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', { content: 'test' }))
      .rejects.toThrow('Error de guardado')
  })

  it('debería manejar errores en populate()', async () => {
    const saveMock = jest.fn().mockResolvedValue()
    const populateMock = jest.fn()
      .mockReturnValueOnce(Promise.resolve())
      .mockRejectedValueOnce(new Error('Error de populate'))

    const reviewMock = {
      author: { toString: () => 'user123' },
      save: saveMock,
      populate: populateMock
    }

    Review.findById.mockResolvedValue(reviewMock)

    await expect(updateReview('507f1f77bcf86cd799439011', 'user123', { content: 'test' }))
      .rejects.toThrow('Error de populate')
  })

  it('debería actualizar solo campos específicos', async () => {
    const populateMock = jest.fn().mockReturnThis()
    const saveMock = jest.fn().mockResolvedValue()

    const reviewMock = {
      author: { toString: () => 'user123' },
      save: saveMock,
      populate: populateMock,
      content: 'contenido original',
      rating: 3
    }

    Review.findById.mockResolvedValue(reviewMock)

    await updateReview('507f1f77bcf86cd799439011', 'user123', { content: 'Solo contenido' })

    expect(reviewMock.content).toBe('Solo contenido')
    expect(reviewMock.rating).toBe(3) 
  })
})
