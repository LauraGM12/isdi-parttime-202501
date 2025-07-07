import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import getProfile from './getProfile.js'

describe('getProfile', () => {
  let findByIdStub

  beforeEach(() => {
    findByIdStub = sinon.stub(data.users, 'findById')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener el perfil del usuario correctamente', async () => {
      const userId = 'userId123'
      const userProfile = {
        _id: userId,
        email: 'test@example.com',
        username: 'testuser',
        bio: 'Test bio'
      }

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().returnsThis(),
        then: sinon.stub().resolves(userProfile)
      }
      mockChain.select.returns(mockChain)
      mockChain.catch.returns(mockChain)
      
      findByIdStub.returns(mockChain)

      const result = await getProfile(userId)

      expect(findByIdStub.calledOnceWith(userId)).to.be.true
      expect(mockChain.select.calledOnceWith('-password')).to.be.true
      expect(result).to.equal(userProfile)
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar ExistenceError si el usuario no existe', async () => {
      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().returnsThis(),
        then: sinon.stub().callsFake((callback) => {
          return callback(null)
        })
      }
      
      findByIdStub.returns(mockChain)

      try {
        await getProfile('507f1f77bcf86cd799439011')
        expect.fail('Debería haber lanzado ExistenceError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ExistenceError)
        expect(error.message).to.equal('user not found')
      }
    })

    it('debería lanzar ServerError si falla la consulta', async () => {
      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().callsFake((callback) => {
          return callback(new Error('Database error'))
        })
      }
      
      findByIdStub.returns(mockChain)

      try {
        await getProfile('507f1f77bcf86cd799439011')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Database error')
      }
    })
  })
})