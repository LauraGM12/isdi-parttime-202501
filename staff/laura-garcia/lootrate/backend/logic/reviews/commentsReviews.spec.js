import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { addComment, getComments, deleteComment } from './commentsReviews.js'

describe('commentsReviews', () => {
  let findByIdStub, saveStub, populateStub
  let mockReview

  beforeEach(() => {
    mockReview = {
      _id: 'reviewId123',
      author: { _id: 'authorId123' },
      comments: [],
      save: sinon.stub().resolves(),
      populate: sinon.stub().returnsThis()
    }

    findByIdStub = sinon.stub(data.reviews, 'findById')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('addComment', () => {
    beforeEach(() => {
      findByIdStub.resolves(mockReview)
      mockReview.comments = {
        push: function(comment) {
          comment.toObject = sinon.stub().returns({ ...comment, _id: 'newCommentId' })
          this[this.length] = comment
          this.length = (this.length || 0) + 1
        },
        length: 0
      }
    })

    it('debería añadir un comentario correctamente', async () => {
      mockReview.populate.resolves(mockReview)

      const result = await addComment('reviewId123', 'userId123', 'Great review!')

      expect(findByIdStub.calledOnceWith('reviewId123')).to.be.true
      expect(mockReview.comments).to.have.length(1)
      expect(mockReview.comments[0].author).to.equal('userId123')
      expect(mockReview.comments[0].content).to.equal('Great review!')
      expect(mockReview.save.called).to.be.true
      expect(mockReview.populate.calledWith('comments.author', 'username avatar')).to.be.true
      expect(result).to.have.property('_id')
      expect(result).to.have.property('id')
      expect(result.id).to.equal(result._id)
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await addComment('reviewId123', 'userId123', 'Great review!')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })
  })

  describe('getComments', () => {
    beforeEach(() => {
      mockReview.comments = [
        { _id: 'comment1', content: 'Comment 1', createdAt: new Date('2023-01-02'), toObject: () => ({ _id: 'comment1', content: 'Comment 1', createdAt: new Date('2023-01-02') }) },
        { _id: 'comment2', content: 'Comment 2', createdAt: new Date('2023-01-01'), toObject: () => ({ _id: 'comment2', content: 'Comment 2', createdAt: new Date('2023-01-01') }) }
      ]
      findByIdStub.returns({ populate: sinon.stub().resolves(mockReview) })
    })

    it('debería obtener comentarios correctamente', async () => {
      const result = await getComments('reviewId123', 1, 10)

      expect(result.comments).to.have.length(2)
      expect(result.total).to.equal(2)
      expect(result.comments[0]._id).to.equal('comment1')
      expect(result.comments[0]).to.have.property('id', 'comment1')
      expect(result.comments[1]).to.have.property('id', 'comment2')
    })

    it('debería paginar comentarios correctamente', async () => {
      const result = await getComments('reviewId123', 1, 1)

      expect(result.comments).to.have.length(1)
      expect(result.total).to.equal(2)
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.returns({ populate: sinon.stub().resolves(null) })

      try {
        await getComments('reviewId123', 1, 10)
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })
  })

  describe('deleteComment', () => {
    let mockComment

    beforeEach(() => {
      mockComment = { _id: 'commentId123', author: 'userId123' }
      mockReview.comments = {
        id: sinon.stub().returns(mockComment),
        pull: sinon.stub()
      }
      findByIdStub.returns({ populate: sinon.stub().resolves(mockReview) })
    })

    it('debería eliminar comentario como autor del comentario', async () => {
      const result = await deleteComment('reviewId123', 'commentId123', 'userId123')

      expect(mockReview.comments.pull.calledOnceWith('commentId123')).to.be.true
      expect(mockReview.save.called).to.be.true
      expect(result).to.be.true
    })

    it('debería eliminar comentario como autor de la reseña', async () => {
      mockComment.author = 'otherUserId'
      mockReview.author._id = 'userId123'

      const result = await deleteComment('reviewId123', 'commentId123', 'userId123')

      expect(mockReview.comments.pull.calledOnceWith('commentId123')).to.be.true
      expect(result).to.be.true
    })

    it('debería lanzar NotFoundError si la reseña no existe', async () => {
      findByIdStub.returns({ populate: sinon.stub().resolves(null) })

      try {
        await deleteComment('reviewId123', 'commentId123', 'userId123')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Reseña no encontrada')
      }
    })

    it('debería lanzar NotFoundError si el comentario no existe', async () => {
      mockReview.comments.id.returns(null)

      try {
        await deleteComment('reviewId123', 'commentId123', 'userId123')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Comentario no encontrado')
      }
    })

    it('debería lanzar AuthError si no tiene permisos', async () => {
      mockComment.author = 'otherUserId'
      mockReview.author._id = 'anotherUserId'

      try {
        await deleteComment('reviewId123', 'commentId123', 'userId123')
        expect.fail('Debería haber lanzado AuthError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthError)
        expect(error.message).to.equal('No tienes permisos para eliminar este comentario')
      }
    })
  })
})