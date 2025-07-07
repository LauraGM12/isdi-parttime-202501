import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import updateProfile from './updateProfile.js'

describe('updateProfile', () => {
  let findByIdAndUpdateStub

  beforeEach(() => {
    findByIdAndUpdateStub = sinon.stub(data.users, 'findByIdAndUpdate')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería actualizar el perfil correctamente', async () => {
      const userId = 'userId123'
      const updateData = {
        username: 'newusername',
        bio: 'New bio',
        invalidField: 'should be filtered'
      }
      const updatedUser = {
        _id: userId,
        username: 'newusername',
        bio: 'New bio'
      }

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().returnsThis(),
        then: sinon.stub().resolves(updatedUser)
      }
      mockChain.select.returns(mockChain)
      mockChain.catch.returns(mockChain)
      
      findByIdAndUpdateStub.returns(mockChain)

      const result = await updateProfile(userId, updateData)

      expect(findByIdAndUpdateStub.calledOnceWith(
        userId,
        { username: 'newusername', bio: 'New bio' },
        { new: true, runValidators: true }
      )).to.be.true
      expect(mockChain.select.calledOnceWith('-password')).to.be.true
      expect(result).to.equal(updatedUser)
    })

    it('debería filtrar solo campos permitidos', async () => {
      const userId = 'userId123'
      const updateData = {
        username: 'newusername',
        email: 'new@email.com',
        password: 'shouldnotbeallowed',
        _id: 'shouldnotbeallowed',
        role: 'shouldnotbeallowed'
      }
      const updatedUser = { _id: userId, username: 'newusername', email: 'new@email.com' }

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().returnsThis(),
        then: sinon.stub().resolves(updatedUser)
      }
      mockChain.select.returns(mockChain)
      mockChain.catch.returns(mockChain)
      
      findByIdAndUpdateStub.returns(mockChain)

      await updateProfile(userId, updateData)

      const expectedFilteredData = {
        username: 'newusername',
        email: 'new@email.com'
      }

      expect(findByIdAndUpdateStub.calledOnceWith(
        userId,
        expectedFilteredData,
        { new: true, runValidators: true }
      )).to.be.true
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar ValidationError si no hay campos válidos', async () => {
      const userId = 'userId123'
      const updateData = {
        invalidField1: 'value1',
        invalidField2: 'value2'
      }

      try {
        await updateProfile(userId, updateData)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('no hay campos válidos para actualizar')
      }
    })

    it('debería lanzar ExistenceError si el usuario no existe', async () => {
      const userId = 'nonexistentId'
      const updateData = { username: 'newusername' }

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().returnsThis(),
        then: sinon.stub().callsFake((successHandler) => {
          try {
            return successHandler(null)
          } catch (error) {
            return Promise.reject(error)
          }
        })
      }
      mockChain.select.returns(mockChain)
      mockChain.catch.returns(mockChain)
      
      findByIdAndUpdateStub.returns(mockChain)

      try {
        await updateProfile(userId, updateData)
        expect.fail('Debería haber lanzado ExistenceError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ExistenceError)
        expect(error.message).to.equal('usuario no encontrado')
      }
    })

    it('debería lanzar DuplicityError en caso de duplicidad (código 11000)', async () => {
      const userId = 'userId123'
      const updateData = { username: 'existingusername' }
      const duplicityError = new Error('Duplicate key')
      duplicityError.code = 11000

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().callsFake((errorHandler) => {
          try {
            errorHandler(duplicityError)
          } catch (handledError) {
            return Promise.reject(handledError)
          }
        }),
        then: sinon.stub()
      }
      mockChain.select.returns(mockChain)
      
      findByIdAndUpdateStub.returns(mockChain)

      try {
        await updateProfile(userId, updateData)
        expect.fail('Debería haber lanzado DuplicityError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.DuplicityError)
        expect(error.message).to.equal('el nombre de usuario o email ya existe')
      }
    })

    it('debería lanzar ServerError para otros errores', async () => {
      const userId = 'userId123'
      const updateData = { username: 'newusername' }
      const serverError = new Error('Database error')

      const mockChain = {
        select: sinon.stub().returnsThis(),
        catch: sinon.stub().callsFake((errorHandler) => {
          try {
            errorHandler(serverError)
          } catch (handledError) {
            return Promise.reject(handledError)
          }
        }),
        then: sinon.stub()
      }
      mockChain.select.returns(mockChain)
      
      findByIdAndUpdateStub.returns(mockChain)

      try {
        await updateProfile(userId, updateData)
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Database error')
      }
    })
  })
})