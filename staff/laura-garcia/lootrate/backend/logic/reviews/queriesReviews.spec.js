import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { getGameReviews, getMyReviews } from './queriesReviews.js'


describe('queriesReviews', () => {
  let findStub, populateStub, sortStub, skipStub, limitStub, countDocumentsStub
  let mockReviews
  let mockQuery

  beforeEach(async () => {

    mockReviews = [
      { _id: 'review1', content: 'Great game!', rating: 8 },
      { _id: 'review2', content: 'Good game!', rating: 7 }
    ]

    mockQuery = {
          populate: sinon.stub(),
          sort: sinon.stub(),
          skip: sinon.stub(),
          limit: sinon.stub()
        }
        mockQuery.populate.returns(mockQuery)
        mockQuery.sort.returns(mockQuery)
        mockQuery.skip.returns(mockQuery)
        mockQuery.limit.resolves(mockReviews)

        findStub = sinon.stub(data.reviews, 'find').returns(mockQuery)
        countDocumentsStub = sinon.stub(data.reviews, 'countDocuments').resolves(2)
      })

  afterEach(() => {
    sinon.restore()
  })

  describe('getGameReviews', () => {
    it('debería obtener reseñas de un juego correctamente', async () => {
      const result = await getGameReviews('gameId123', 1, 10, 'createdAt')

      expect(findStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      expect(countDocumentsStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      expect(result).to.deep.equal({ reviews: mockReviews, total: 2 })  
    })

    it('debería ordenar por rating cuando se especifica', async () => {
      await getGameReviews('gameId123', 1, 10, 'rating')

      expect(mockQuery.sort.calledOnceWith({ rating: -1 })).to.be.true
    })

    it('debería ordenar por helpful cuando se especifica', async () => {
      await getGameReviews('gameId123', 1, 10, 'helpful')

      expect(mockQuery.sort.calledOnceWith({ helpfulCount: -1 })).to.be.true
    })

    it('debería usar ordenamiento por defecto para sortBy inválido', async () => {
      await getGameReviews('gameId123', 1, 10, 'invalid')

      expect(mockQuery.sort.calledOnceWith({ createdAt: -1 })).to.be.true
    })

    it('debería calcular skip correctamente', async () => {
      await getGameReviews('gameId123', 3, 5)

      expect(mockQuery.skip.calledOnceWith(10)).to.be.true
    })
  })
})