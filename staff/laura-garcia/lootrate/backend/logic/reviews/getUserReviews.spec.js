import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { getUserReviews } from './getUserReviews.js'

describe('getUserReviews', () => {
  let findStub, countDocumentsStub
  let mockReviews
  const validUserId = '507f1f77bcf86cd799439011'

  beforeEach(() => {
    mockReviews = [
      { _id: 'review1', content: 'Great game!', rating: 8 },
      { _id: 'review2', content: 'Good game!', rating: 7 }
    ]

    const mockQuery = {
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

  describe('casos exitosos', () => {
    it('debería obtener reseñas del usuario correctamente', async () => {
      const result = await getUserReviews(validUserId, 1, 10)

      expect(findStub.calledOnceWith({ author: validUserId })).to.be.true
      expect(countDocumentsStub.calledOnceWith({ author: validUserId })).to.be.true
      expect(result).to.deep.equal({ reviews: mockReviews, total: 2 })
    })

    it('debería calcular skip correctamente para páginas diferentes', async () => {
      const result = await getUserReviews(validUserId, 3, 5)

      expect(findStub.calledOnceWith({ author: validUserId })).to.be.true
      expect(result).to.deep.equal({ reviews: mockReviews, total: 2 })
    })

    it('debería usar valores por defecto para page y limit', async () => {
      const result = await getUserReviews(validUserId)

      expect(findStub.calledOnceWith({ author: validUserId })).to.be.true
      expect(result).to.deep.equal({ reviews: mockReviews, total: 2 })
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