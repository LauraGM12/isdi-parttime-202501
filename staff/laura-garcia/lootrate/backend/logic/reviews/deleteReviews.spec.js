import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { deleteReview } from './deleteReviews.js'

describe('deleteReview', () => {
  let findByIdStub, findByIdAndDeleteStub
  let mockReview
  const validReviewId = '507f1f77bcf86cd799439011'
  const validUserId = '507f1f77bcf86cd799439012'
  const otherUserId = '507f1f77bcf86cd799439013'

  beforeEach(() => {
    mockReview = {
      _id: validReviewId,
      author: validUserId,
      content: 'Test review'
    }

    findByIdStub = sinon.stub(data.reviews, 'findById').resolves(mockReview)
    findByIdAndDeleteStub = sinon.stub(data.reviews, 'findByIdAndDelete').resolves()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería eliminar una reseña correctamente', async () => {
      const result = await deleteReview(validReviewId, validUserId)

      expect(findByIdStub.calledOnceWith(validReviewId)).to.be.true
      expect(findByIdAndDeleteStub.calledOnceWith(validReviewId)).to.be.true
      expect(result).to.be.true
    })
  })

  describe('validaciones', () => {
    it('debería lanzar error para reviewId inválido', async () => {
      try {
        await deleteReview('invalid', validUserId)
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('reviewId')
      }
    })

    it('debería lanzar error para userId inválido', async () => {
      try {
        await deleteReview(validReviewId, 'invalid')
        expect.fail('Debería haber lanzado error')
      } catch (error) {
        expect(error.message).to.include('userId')
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await deleteReview(validReviewId, validUserId)
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })

    it('debería lanzar AuthError si el usuario no es el autor', async () => {
      mockReview.author = otherUserId

      try {
        await deleteReview(validReviewId, validUserId)
        expect.fail('Debería haber lanzado AuthError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthError)
        expect(error.message).to.equal('El usuario no es el autor de esta reseña')
      }
    })
  })
})