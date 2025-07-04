import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { toggleLike, toggleHelpful } from './interactionsReviews.js'
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
    }
  }
}))

describe('interactionsReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('toggleLike', () => {
    it('debería marcar like si no estaba marcado', async () => {
      const review = {
        likes: [],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleLike('reviewId123', 'userId456')

      expect(Review.findById).toHaveBeenCalledWith('reviewId123')
      expect(result).toEqual({ liked: true, likesCount: 1 })
      expect(review.likes).toContain('userId456')
      expect(review.save).toHaveBeenCalled()
    })

    it('debería desmarcar like si ya estaba marcado', async () => {
      const review = {
        likes: ['userId456'],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleLike('reviewId123', 'userId456')

      expect(result).toEqual({ liked: false, likesCount: 0 })
      expect(review.likes).not.toContain('userId456')
      expect(review.save).toHaveBeenCalled()
    })

    it('debería manejar userId como ObjectId', async () => {
      const review = {
        likes: [{ toString: () => 'userId456' }],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleLike('reviewId123', 'userId456')

      expect(result).toEqual({ liked: false, likesCount: 0 })
      expect(review.save).toHaveBeenCalled()
    })

    it('debería lanzar NotFoundError si no encuentra la reseña', async () => {
      Review.findById.mockResolvedValue(null)

      await expect(toggleLike('invalidId', 'userId456')).rejects.toThrow(errors.NotFoundError)
      await expect(toggleLike('invalidId', 'userId456')).rejects.toThrow('Reseña no encontrada')
    })
  })

  describe('toggleHelpful', () => {
    it('debería marcar como útil si no lo estaba', async () => {
      const review = {
        helpful: [],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleHelpful('reviewId123', 'userId456')

      expect(Review.findById).toHaveBeenCalledWith('reviewId123')
      expect(result).toEqual({ helpful: true, helpfulCount: 1 })
      expect(review.helpful).toContain('userId456')
      expect(review.save).toHaveBeenCalled()
    })

    it('debería desmarcar como útil si ya lo estaba', async () => {
      const review = {
        helpful: ['userId456'],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleHelpful('reviewId123', 'userId456')

      expect(result).toEqual({ helpful: false, helpfulCount: 0 })
      expect(review.helpful).not.toContain('userId456')
      expect(review.save).toHaveBeenCalled()
    })

    it('debería manejar userId como ObjectId', async () => {
      const review = {
        helpful: [{ toString: () => 'userId456' }],
        save: jest.fn().mockResolvedValue()
      }

      Review.findById.mockResolvedValue(review)

      const result = await toggleHelpful('reviewId123', 'userId456')

      expect(result).toEqual({ helpful: false, helpfulCount: 0 })
      expect(review.save).toHaveBeenCalled()
    })

    it('debería lanzar NotFoundError si no encuentra la reseña', async () => {
      Review.findById.mockResolvedValue(null)

      await expect(toggleHelpful('invalidId', 'userId456')).rejects.toThrow(errors.NotFoundError)
      await expect(toggleHelpful('invalidId', 'userId456')).rejects.toThrow('Reseña no encontrada')
    })
  })
})