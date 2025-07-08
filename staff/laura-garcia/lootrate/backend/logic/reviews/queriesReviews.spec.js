import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { getGameReviews } from './queriesReviews.js'

describe('queriesReviews', () => {
  let findStub, populateStub, sortStub, skipStub, limitStub, countDocumentsStub
  let mockReviews

  beforeEach(() => {
    mockReviews = [
      { _id: 'review1', content: 'Great game!', rating: 4, toObject: () => ({ _id: 'review1', content: 'Great game!', rating: 4, id: 'review1' }) },
      { _id: 'review2', content: 'Good game!', rating: 3, toObject: () => ({ _id: 'review2', content: 'Good game!', rating: 3, id: 'review2' }) }
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
      const result = await getGameReviews('gameId123', 1, 10, 'createdAt')

      expect(findStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      expect(populateStub.calledOnceWith('author', 'username avatar')).to.be.true
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
      expect(skipStub.calledOnceWith(0)).to.be.true
      expect(limitStub.calledOnceWith(10)).to.be.true
      expect(countDocumentsStub.calledOnceWith({ game: 'gameId123' })).to.be.true
      
      expect(result.reviews).to.have.lengthOf(2)
      expect(result.reviews[0]).to.have.property('_id', 'review1')
      expect(result.reviews[0]).to.have.property('id', 'review1')
      expect(result.total).to.equal(2)
    })

    it('debería ordenar por rating cuando se especifica', async () => {
      await getGameReviews('gameId123', 1, 10, 'rating')
      expect(sortStub.calledOnceWith({ rating: -1 })).to.be.true
    })

    it('debería ordenar por helpful cuando se especifica', async () => {
      await getGameReviews('gameId123', 1, 10, 'helpful')
      expect(sortStub.calledOnceWith({ helpfulCount: -1 })).to.be.true
    })

    it('debería usar ordenamiento por defecto para sortBy inválido', async () => {
      await getGameReviews('gameId123', 1, 10, 'invalid')
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
    })

    it('debería calcular skip correctamente', async () => {
      await getGameReviews('gameId123', 3, 5)
      expect(skipStub.calledOnceWith(10)).to.be.true
    })
  })

  describe.skip('getMyReviews', () => {
  })
})