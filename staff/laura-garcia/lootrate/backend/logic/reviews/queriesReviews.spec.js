import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const findMock = jest.fn();
const countDocumentsMock = jest.fn();
const getUserReviewsMock = jest.fn();
const getGameDetailsMock = jest.fn();

jest.mock('../../data/index.js', () => ({
  data: {
    reviews: {
      find: findMock,
      countDocuments: countDocumentsMock
    }
  }
}));

jest.mock('./getUserReviews.js', () => ({
  getUserReviews: getUserReviewsMock
}));

jest.mock('../games/rawgService.js', () => ({
  getGameDetails: getGameDetailsMock
}));

import { data } from '../../data/index.js';
import { getGameReviews, getMyReviews } from './queriesReviews.js';

describe('queriesReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGameReviews', () => {
    const findChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ id: 1 }])
    };

    beforeEach(() => {
      findMock.mockReturnValue(findChain);
      countDocumentsMock.mockResolvedValue(1);
    });

    it('debería devolver reseñas ordenadas por defecto (createdAt)', async () => {
      const result = await getGameReviews(123); 

      expect(findMock).toHaveBeenCalledWith({ game: 123 });
      expect(findChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual({ reviews: [{ id: 1 }], total: 1 });
    }, 5000); 

    it('debería ordenar por rating si se especifica', async () => {
      await getGameReviews(123, 1, 10, 'rating'); 

      expect(findChain.sort).toHaveBeenCalledWith({ rating: -1 });
    }, 5000); 

    it('debería ordenar por helpful si se especifica', async () => {
      await getGameReviews(123, 1, 10, 'helpful'); 

      expect(findChain.sort).toHaveBeenCalledWith({ helpfulCount: -1 });
    }, 5000); 

    it('debería caer en orden por createdAt si sortBy no es válido', async () => {
      await getGameReviews(123, 1, 10, 'invalid'); 

      expect(findChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
    }, 5000); 
  });

  describe('getMyReviews', () => {
    it('debería devolver reviews del usuario con juegos enriquecidos', async () => {
      const fakeGame = {
        toObject: () => ({ title: 'Título original', rawgId: 999 })
      };

      const enrichedData = {
        genres: ['Action'],
        rating: 4.5
      };

      getUserReviewsMock.mockResolvedValue({
        reviews: [
          { game: fakeGame }
        ],
        total: 1
      });

      getGameDetailsMock.mockResolvedValue(enrichedData);

      const result = await getMyReviews('507f1f77bcf86cd799439011');

      expect(getUserReviewsMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 1, 10);
      expect(getGameDetailsMock).toHaveBeenCalledWith(999);

      expect(result.reviews[0].game).toEqual({
        ...fakeGame.toObject(),
        ...enrichedData
      });

      expect(result.total).toBe(1);
    });

    it('debería omitir enriquecimiento si la reseña no tiene rawgId', async () => {
      getUserReviewsMock.mockResolvedValue({
        reviews: [
          { game: {} }
        ],
        total: 1
      });

      const result = await getMyReviews('507f1f77bcf86cd799439012');

      expect(getGameDetailsMock).not.toHaveBeenCalled();
      expect(result.total).toBe(1);
    });
  });
});
