import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { toggleLike, toggleHelpful } from './interactionsReviews.js'

describe('interactionsReviews', () => {
  let findByIdStub, saveStub
  let mockReview

  beforeEach(() => {
    mockReview = {
      _id: 'reviewId123',
      likes: [],
      helpful: [],
      save: sinon.stub().resolves()
    }

    findByIdStub = sinon.stub(data.reviews, 'findById').resolves(mockReview)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('toggleLike', () => {
    it('debería añadir like si no existe', async () => {
      const result = await toggleLike('reviewId123', 'userId123')

      expect(findByIdStub.calledOnceWith('reviewId123')).to.be.true
      expect(mockReview.likes).to.include('userId123')
      expect(mockReview.save.called).to.be.true
      expect(result).to.deep.equal({ liked: true, likesCount: 1 })
    })

    it('debería quitar like si ya existe', async () => {
      mockReview.likes = ['userId123']

      const result = await toggleLike('reviewId123', 'userId123')

      expect(mockReview.likes).to.not.include('userId123')
      expect(result).to.deep.equal({ liked: false, likesCount: 0 })
    })

    it('debería manejar múltiples likes', async () => {
      mockReview.likes = ['otherUserId']

      const result = await toggleLike('reviewId123', 'userId123')

      expect(mockReview.likes).to.have.length(2)
      expect(mockReview.likes).to.include('userId123')
      expect(mockReview.likes).to.include('otherUserId')
      expect(result.likesCount).to.equal(2)
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await toggleLike('reviewId123', 'userId123')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })
  })

  describe('toggleHelpful', () => {
    it('debería añadir helpful si no existe', async () => {
      const result = await toggleHelpful('reviewId123', 'userId123')

      expect(findByIdStub.calledOnceWith('reviewId123')).to.be.true
      expect(mockReview.helpful).to.include('userId123')
      expect(mockReview.save.called).to.be.true
      expect(result).to.deep.equal({ helpful: true, helpfulCount: 1 })
    })

    it('debería quitar helpful si ya existe', async () => {
      mockReview.helpful = ['userId123']

      const result = await toggleHelpful('reviewId123', 'userId123')

      expect(mockReview.helpful).to.not.include('userId123')
      expect(result).to.deep.equal({ helpful: false, helpfulCount: 0 })
    })

    it('debería manejar múltiples helpful', async () => {
      mockReview.helpful = ['otherUserId']

      const result = await toggleHelpful('reviewId123', 'userId123')

      expect(mockReview.helpful).to.have.length(2)
      expect(mockReview.helpful).to.include('userId123')
      expect(mockReview.helpful).to.include('otherUserId')
      expect(result.helpfulCount).to.equal(2)
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await toggleHelpful('reviewId123', 'userId123')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })
  })
})