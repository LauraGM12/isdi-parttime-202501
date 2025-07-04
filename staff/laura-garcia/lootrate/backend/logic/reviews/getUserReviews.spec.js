import { describe, it, expect, jest, beforeEach } from '@jest/globals'

const findMock = jest.fn()
const countDocumentsMock = jest.fn()
const validateIdMock = jest.fn()


jest.mock('../../data/index.js', () => ({
  data: {
    reviews: {
      find: findMock,
      countDocuments: countDocumentsMock
    }
  }
}))

jest.mock('common', () => ({
  validator: {
    validateId: validateIdMock
  },
  errors: {
    FormatError: class FormatError extends Error {
      constructor(message) {
        super(message)
        this.name = 'FormatError'
      }
    },
    ValidationError: class ValidationError extends Error {
      constructor(message) {
        super(message)
        this.name = 'ValidationError'
      }
    }
  }
}))

import { getUserReviews } from './getUserReviews.js'
import { data } from '../../data/index.js'
import { validator } from 'common'

const Review = data.reviews

describe('getUserReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    const reviews = [
      { id: 1, content: 'Review 1' },
      { id: 2, content: 'Review 2' }
    ]
    
    const mockChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(reviews) 
    }
    
    findMock.mockReturnValue(mockChain)
    countDocumentsMock.mockResolvedValue(10) 
    
    validateIdMock.mockImplementation(() => {})
  })

  it('debería devolver reseñas del usuario correctamente', async () => {
    const result = await getUserReviews('507f1f77bcf86cd799439011')

    expect(validator.validateId).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'userId')

    expect(Review.find).toHaveBeenCalledWith({ author: '507f1f77bcf86cd799439011' })
    expect(Review.countDocuments).toHaveBeenCalledWith({ author: '507f1f77bcf86cd799439011' })

    expect(result).toEqual({
      reviews: [
        { id: 1, content: 'Review 1' },
        { id: 2, content: 'Review 2' }
      ],
      total: 10
    })
  })

  it('debería manejar resultados vacíos', async () => {
    const emptyChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]) 
    }
    
    findMock.mockReturnValue(emptyChain)
    countDocumentsMock.mockResolvedValue(0) 

    const result = await getUserReviews('507f1f77bcf86cd799439011')

    expect(Review.countDocuments).toHaveBeenCalledWith({ author: '507f1f77bcf86cd799439011' })
    expect(result).toEqual({
      reviews: [],
      total: 0
    })
  })

  it('debería manejar errores de validación de userId', async () => {
    validateIdMock.mockImplementation(() => {
      throw new Error('formato de userId inválido')
    })

    await expect(getUserReviews('invalid-id'))
      .rejects.toThrow('formato de userId inválido')
  })
})
