import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { updateReview } from './updateReviews.js'

describe('updateReview', () => {
  let findByIdStub, saveStub, populateStub
  let mockReview

  beforeEach(() => {
    mockReview = {
      _id: '507f1f77bcf86cd799439011',
      author: '507f1f77bcf86cd799439012',
      content: 'Original content',
      rating: 7,
      save: sinon.stub().resolves(),
      populate: sinon.stub().returnsThis()
    }

    findByIdStub = sinon.stub(data.reviews, 'findById').resolves(mockReview)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería actualizar una reseña correctamente', async () => {
      const updates = { content: 'Updated content', rating: 9 }
      mockReview.populate.resolves(mockReview)

      const result = await updateReview('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', updates)

      expect(findByIdStub.calledOnceWith('507f1f77bcf86cd799439011')).to.be.true
      expect(mockReview.save.called).to.be.true
      expect(mockReview.populate.calledWith('author', 'username avatar')).to.be.true
      expect(mockReview.populate.calledWith('game', 'name cover')).to.be.true
      expect(result).to.equal(mockReview)
    })

    it('debería aplicar solo las actualizaciones proporcionadas', async () => {
      const updates = { rating: 10 }
      mockReview.populate.resolves(mockReview)

      await updateReview('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', updates)

      expect(mockReview.rating).to.equal(10)
      expect(mockReview.content).to.equal('Original content')
    })
  })

  describe('validaciones', () => {
    it('debería lanzar ValidationError para reviewId inválido', async () => {
      try {
        await updateReview('', '507f1f77bcf86cd799439012', { rating: 8 })
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })

    it('debería lanzar ValidationError para userId inválido', async () => {
      try {
        await updateReview('507f1f77bcf86cd799439011', '', { rating: 8 })
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await updateReview('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', { rating: 8 })
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })

    it('debería lanzar AuthError si el usuario no es el autor', async () => {
      mockReview.author = '507f1f77bcf86cd799439013'

      try {
        await updateReview('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', { rating: 8 })
        expect.fail('Debería haber lanzado AuthError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthError)
        expect(error.message).to.equal('El usuario no es el autor de esta reseña')
      }
    })
  })
})