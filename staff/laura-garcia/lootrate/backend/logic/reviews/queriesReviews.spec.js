import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'

describe('queriesReviews', () => {
  let findStub, populateStub, sortStub, skipStub, limitStub, countDocumentsStub
  let mockReviews
  let getUserReviewsStub, getGameDetailsStub
  let queriesReviewsModule

  beforeEach(async () => {
    queriesReviewsModule = await import('./queriesReviews.js')
    
    mockReviews = [
      { _id: 'review1', content: 'Great game!', rating: 8, toObject: () => ({ _id: 'review1', content: 'Great game!', rating: 8 }) },
      { _id: 'review2', content: 'Good game!', rating: 7, toObject: () => ({ _id: 'review2', content: 'Good game!', rating: 7 }) }
    ]

    limitStub = sinon.stub().resolves(mockReviews)
    skipStub = sinon.stub().returns({ limit: limitStub })
    sortStub = sinon.stub().returns({ skip: skipStub })
    populateStub = sinon.stub().returns({ sort: sortStub })
    findStub = sinon.stub(data.reviews, 'find').returns({ populate: populateStub })
    countDocumentsStub = sinon.stub(data.reviews, 'countDocuments').resolves(2)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getGameReviews', () => {
    it('debería obtener reseñas de un juego correctamente', async () => {
      const result = await queriesReviewsModule.getGameReviews('gameId123', 1, 10, 'createdAt')

      expect(findStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      expect(populateStub.calledOnceWith('author', 'username avatar')).to.be.true
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
      expect(skipStub.calledOnceWith(0)).to.be.true
      expect(limitStub.calledOnceWith(10)).to.be.true
      expect(countDocumentsStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      
      expect(result.reviews).to.have.lengthOf(2)
      expect(result.reviews[0]).to.have.property('_id', 'review1')
      expect(result.reviews[0]).to.have.property('id', 'review1')
      expect(result.reviews[1]).to.have.property('_id', 'review2')
      expect(result.reviews[1]).to.have.property('id', 'review2')
      expect(result.total).to.equal(2)
    })

    it('debería ordenar por rating cuando se especifica', async () => {
      await queriesReviewsModule.getGameReviews('gameId123', 1, 10, 'rating')

      expect(sortStub.calledOnceWith({ rating: -1 })).to.be.true
    })

    it('debería ordenar por helpful cuando se especifica', async () => {
      await queriesReviewsModule.getGameReviews('gameId123', 1, 10, 'helpful')

      expect(sortStub.calledOnceWith({ helpfulCount: -1 })).to.be.true
    })

    it('debería usar ordenamiento por defecto para sortBy inválido', async () => {
      await queriesReviewsModule.getGameReviews('gameId123', 1, 10, 'invalid')

      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
    })

    it('debería calcular skip correctamente', async () => {
      await queriesReviewsModule.getGameReviews('gameId123', 3, 5)

      expect(skipStub.calledOnceWith(10)).to.be.true
    })
  })

  describe('getMyReviews', () => {
    beforeEach(() => {
      const mockReviewsWithGame = [
        {
          _id: 'review1',
          game: { rawgId: 123, toObject: () => ({ rawgId: 123 }) },
          content: 'Great!',
          toObject: () => ({
            _id: 'review1',
            game: { rawgId: 123 },
            content: 'Great!'
          })
        }
      ]
  
      limitStub.resolves(mockReviewsWithGame)
      countDocumentsStub.resolves(1)
      
      const populateStub1 = sinon.stub()
      const populateStub2 = sinon.stub()
      
      populateStub1.returns({
        populate: populateStub2.returns({
          sort: sortStub
        })
      })
      
      findStub.returns({
        populate: populateStub1
      })
    })

    it('debería obtener reseñas del usuario con detalles del juego', async () => {
      const validUserId = '507f1f77bcf86cd799439011'
      const result = await queriesReviewsModule.getMyReviews(validUserId, 1, 10)
  
      expect(result).to.have.property('reviews')
      expect(result).to.have.property('total')
      expect(result.reviews).to.be.an('array')
      expect(result.total).to.be.a('number')
    })
  
    it('debería manejar reseñas sin rawgId', async () => {
      const validUserId = '507f1f77bcf86cd799439011'
      const mockReviewsWithoutRawgId = [
        { 
          _id: 'review1', 
          game: {}, 
          content: 'Great!',
          toObject: () => ({
            _id: 'review1',
            game: {},
            content: 'Great!'
          })
        }
      ]
      
      limitStub.resolves(mockReviewsWithoutRawgId)
  
      const result = await queriesReviewsModule.getMyReviews(validUserId, 1, 10)
  
      expect(result.reviews).to.have.length(1)
    })
  })
})