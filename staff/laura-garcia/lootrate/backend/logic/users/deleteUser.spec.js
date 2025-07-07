import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'
import deleteUser from './deleteUser.js'

describe('deleteUser', () => {
  let findByIdStub, compareStub, deleteManyStub, findByIdAndDeleteStub

  beforeEach(() => {
    findByIdStub = sinon.stub(data.users, 'findById')
    compareStub = sinon.stub(bcrypt, 'compare')
    deleteManyStub = sinon.stub(data.reviews, 'deleteMany')
    findByIdAndDeleteStub = sinon.stub(data.users, 'findByIdAndDelete')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería eliminar el usuario correctamente', async () => {
      const userId = 'userId123'
      const email = 'test@example.com'
      const password = 'password123'
      const user = {
        _id: userId,
        email: email,
        password: 'hashedPassword'
      }

      findByIdStub.resolves(user)
      compareStub.resolves(true)
      deleteManyStub.resolves()
      findByIdAndDeleteStub.resolves()

      const result = await deleteUser(userId, email, password)

      expect(findByIdStub.calledOnceWith(userId)).to.be.true
      expect(compareStub.calledOnceWith(password, user.password)).to.be.true
      expect(deleteManyStub.calledOnceWith({ author: userId })).to.be.true
      expect(findByIdAndDeleteStub.calledOnceWith(userId)).to.be.true
      expect(result).to.deep.equal({
        message: 'Cuenta eliminada exitosamente'
      })
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar NotFoundError si el usuario no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await deleteUser('nonexistentId', 'test@example.com', 'password')
        expect.fail('Debería haber lanzado NotFoundError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.NotFoundError)
        expect(error.message).to.equal('Usuario no encontrado')
      }
    })

    it('debería lanzar CredentialsError si el email no coincide', async () => {
      const user = {
        _id: 'userId123',
        email: 'correct@example.com',
        password: 'hashedPassword'
      }

      findByIdStub.resolves(user)

      try {
        await deleteUser('userId123', 'wrong@example.com', 'password')
        expect.fail('Debería haber lanzado CredentialsError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.CredentialsError)
        expect(error.message).to.equal('El email no coincide')
      }
    })

    it('debería lanzar CredentialsError si la contraseña es incorrecta', async () => {
      const user = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      findByIdStub.resolves(user)
      compareStub.resolves(false)

      try {
        await deleteUser('userId123', 'test@example.com', 'wrongpassword')
        expect.fail('Debería haber lanzado CredentialsError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.CredentialsError)
        expect(error.message).to.equal('Contraseña incorrecta')
      }
    })
  })
})