import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { createReview } from './createReviews.js'

describe('createReview', () => {
  let findOneStub, saveStub, populateStub
  let mockReview
  const validUserId = '507f1f77bcf86cd799439011'
  const validGameId = '507f1f77bcf86cd799439012'

  beforeEach(() => {
    mockReview = {
      _id: '507f1f77bcf86cd799439013',
      author: validUserId,
      game: validGameId,
      content: 'Great game!',
      rating: 8,
      save: sinon.stub(),
      populate: sinon.stub().returnsThis(),
      toObject: sinon.stub().returnsThis()
    }

    findOneStub = sinon.stub(data.reviews, 'findOne')
    sinon.stub(data.reviews.prototype, 'save')
    sinon.stub(data.reviews.prototype, 'populate').returnsThis()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería crear una reseña correctamente', async () => {
      findOneStub.resolves(null)
      data.reviews.prototype.save.resolves()
      data.reviews.prototype.populate.resolves(mockReview)

      const result = await createReview(validUserId, validGameId, 'Great game!', 8)

      expect(result.content).to.equal(mockReview.content)
    })

    it('debería recortar espacios en blanco del contenido', async () => {
      findOneStub.resolves(null)
      data.reviews.prototype.save.resolves()
      data.reviews.prototype.populate.resolves(mockReview)

      await createReview(validUserId, validGameId, '  Great game!  ', 8)

      expect(data.reviews.prototype.save.called).to.be.true
    })
  })

  describe('validaciones', () => {
    it('debería lanzar ValidationError para userId inválido', async () => {
      try {
        await createReview('invalid', validGameId, 'Great game!', 8)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })

    it('debería lanzar ValidationError para gameId inválido', async () => {
      try {
        await createReview(validUserId, 'invalid', 'Great game!', 8)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })

    it('debería lanzar ValidationError para contenido muy corto', async () => {
      try {
        await createReview(validUserId, validGameId, 'Short', 8)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })

    it('debería lanzar ValidationError para rating inválido', async () => {
      try {
        await createReview(validUserId, validGameId, 'Great game!', 11)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería lanzar DuplicityError si ya existe una reseña', async () => {
      findOneStub.resolves(mockReview)

      try {
        await createReview(validUserId, validGameId, 'Great game!', 8)
        expect.fail('Debería haber lanzado DuplicityError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.DuplicityError)
        expect(error.message).to.equal('User has already reviewed this game')
      }
    })

    it('debería manejar error de clave duplicada de MongoDB', async () => {
      findOneStub.resolves(null)
      const duplicateError = new Error('Duplicate key')
      duplicateError.code = 11000
      data.reviews.prototype.save.rejects(duplicateError)

      try {
        await createReview(validUserId, validGameId, 'Great game!', 8)
        expect.fail('Debería haber lanzado DuplicityError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.DuplicityError)
        expect(error.message).to.equal('User has already reviewed this game')
      }
    })
  })
})