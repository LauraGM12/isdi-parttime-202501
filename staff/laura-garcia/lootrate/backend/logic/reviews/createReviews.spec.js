import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { createReview } from './createReviews.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

jest.mock('../../data/index.js', () => ({
  data: {
    reviews: jest.fn()
  }
}))

const Review = data.reviews

jest.mock('common', () => ({
  errors: {
    DuplicityError: class DuplicityError extends Error {
      constructor(message) {
        super(message)
        this.name = 'DuplicityError'
      }
    }
  }
}))

describe('createReview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería crear y devolver la reseña correctamente', async () => {
    const mockReview = {
      author: 'userId123',
      game: 'gameId456',
      content: 'Excelente juego con más de diez caracteres',
      rating: 5,
      save: jest.fn().mockResolvedValue(),
      populate: jest.fn().mockReturnThis()
    }
    
    Review.mockImplementation(() => mockReview)

    const result = await createReview('userId123', 'gameId456', 'Excelente juego con más de diez caracteres', 5)

    expect(Review).toHaveBeenCalledWith({
      author: 'userId123',
      game: 'gameId456',
      content: 'Excelente juego con más de diez caracteres',
      rating: 5
    })

    expect(mockReview.save).toHaveBeenCalled()
    expect(mockReview.populate).toHaveBeenCalledWith('author', 'username avatar')
    expect(mockReview.populate).toHaveBeenCalledWith('game', 'name cover')
    expect(result).toBe(mockReview)
  })

  it('debería manejar errores de guardado', async () => {
    const mockReview = {
      save: jest.fn().mockRejectedValue(new Error('Error de base de datos')),
      populate: jest.fn().mockReturnThis()
    }
    
    Review.mockImplementation(() => mockReview)

    await expect(createReview('userId123', 'gameId456', 'Contenido válido', 5))
      .rejects.toThrow('Error de base de datos')
  })

  it('debería manejar errores de populate', async () => {
    const mockReview = {
      save: jest.fn().mockResolvedValue(),
      populate: jest.fn().mockRejectedValue(new Error('Error en populate'))
    }
    
    Review.mockImplementation(() => mockReview)

    await expect(createReview('userId123', 'gameId456', 'Contenido válido', 5))
      .rejects.toThrow('Error en populate')
  })

  it('debería crear reseña con rating mínimo', async () => {
    const mockReview = {
      save: jest.fn().mockResolvedValue(),
      populate: jest.fn().mockReturnThis()
    }
    
    Review.mockImplementation(() => mockReview)

    await createReview('userId123', 'gameId456', 'Contenido con rating mínimo', 1)

    expect(Review).toHaveBeenCalledWith({
      author: 'userId123',
      game: 'gameId456',
      content: 'Contenido con rating mínimo',
      rating: 1
    })
  })

  it('debería crear reseña con rating máximo', async () => {
    const mockReview = {
      save: jest.fn().mockResolvedValue(),
      populate: jest.fn().mockReturnThis()
    }
    
    Review.mockImplementation(() => mockReview)

    await createReview('userId123', 'gameId456', 'Contenido excelente', 10)

    expect(Review).toHaveBeenCalledWith({
      author: 'userId123',
      game: 'gameId456',
      content: 'Contenido excelente',
      rating: 10
    })
  })
})