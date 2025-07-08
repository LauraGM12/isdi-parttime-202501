import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { getUserReviews } from './getUserReviews.js'

describe('getUserReviews', () => {
  let findStub, populateStub, sortStub, skipStub, limitStub, countDocumentsStub
  let mockReviews
  const validUserId = '507f1f77bcf86cd799439011'

  beforeEach(() => {
    mockReviews = [
      { _id: 'review1', content: 'Great game!', rating: 4, toObject: () => ({ _id: 'review1', content: 'Great game!', rating: 4 }) },
      { _id: 'review2', content: 'Good game!', rating: 3, toObject: () => ({ _id: 'review2', content: 'Good game!', rating: 3 }) }
    ]

    limitStub = sinon.stub().resolves(mockReviews)
    skipStub = sinon.stub().returns({ limit: limitStub })
    sortStub = sinon.stub().returns({ skip: skipStub })
    
    const chainObject = {
      sort: sortStub
    }
    
    populateStub = sinon.stub().returns(chainObject)
    
    findStub = sinon.stub(data.reviews, 'find').returns({
      populate: populateStub
    })
    
    countDocumentsStub = sinon.stub(data.reviews, 'countDocuments').resolves(2)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener reseñas del usuario correctamente', async () => {
      const result = await getUserReviews(validUserId, 1, 10)

      expect(findStub.calledOnceWith({ author: validUserId })).to.be.true
      expect(populateStub.calledWith('author', 'username avatar')).to.be.true
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
      expect(skipStub.calledOnceWith(0)).to.be.true
      expect(limitStub.calledOnceWith(10)).to.be.true
      expect(countDocumentsStub.calledOnceWith({ author: validUserId })).to.be.true
      
      expect(result.reviews).to.have.lengthOf(2)
      expect(result.reviews[0]).to.have.property('_id', 'review1')
      expect(result.reviews[0]).to.have.property('id', 'review1')
      expect(result.reviews[1]).to.have.property('_id', 'review2')
      expect(result.reviews[1]).to.have.property('id', 'review2')
      expect(result.total).to.equal(2)
    })

    it('debería calcular skip correctamente para páginas diferentes', async () => {
      await getUserReviews(validUserId, 3, 5)

      expect(skipStub.calledOnceWith(10)).to.be.true
      expect(limitStub.calledOnceWith(5)).to.be.true
    })

    it('debería usar valores por defecto para page y limit', async () => {
      await getUserReviews(validUserId)

      expect(skipStub.calledOnceWith(0)).to.be.true
      expect(limitStub.calledOnceWith(10)).to.be.true
    })
  })

  describe('validaciones', () => {
    it('debería lanzar error para userId inválido', async () => {
      try {
        await getUserReviews('')
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('userId')
      }
    })

    it('debería lanzar error para page inválida', async () => {
      try {
        await getUserReviews(validUserId, 0)
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('page')
      }
    })

    it('debería lanzar error para limit inválido', async () => {
      try {
        await getUserReviews(validUserId, 1, 0)
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('limit')
      }
    })

    it('debería lanzar error para limit mayor a 50', async () => {
      try {
        await getUserReviews(validUserId, 1, 51)
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('limit')
      }
    })
  })
})