import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'
import loginUser from './loginUser.js'

describe('loginUser', () => {
  let findOneStub, compareStub, consoleStub

  beforeEach(() => {
    findOneStub = sinon.stub(data.users, 'findOne')
    compareStub = sinon.stub(bcrypt, 'compare')
    consoleStub = sinon.stub(console, 'log')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería hacer login correctamente', async () => {
      const email = 'Test@Example.com'
      const password = 'password123'
      const user = {
        _id: { toString: () => 'userId123' },
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      findOneStub.resolves(user)
      compareStub.resolves(true)

      const result = await loginUser(email, password)

      expect(findOneStub.calledOnceWith({ email: 'test@example.com' })).to.be.true
      expect(compareStub.calledOnceWith(password, user.password)).to.be.true
      expect(result).to.equal('userId123')
    })

    it('debería normalizar el email (lowercase y trim)', async () => {
      const email = '  Test@Example.COM  '
      const user = {
        _id: { toString: () => 'userId123' },
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      findOneStub.resolves(user)
      compareStub.resolves(true)

      await loginUser(email, 'password123')

      expect(findOneStub.calledOnceWith({ email: 'test@example.com' })).to.be.true
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar ExistenceError si el usuario no existe', async () => {
      findOneStub.resolves(null)

      try {
        await loginUser('test@example.com', 'password123')
        expect.fail('Debería haber lanzado ExistenceError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ExistenceError)
        expect(error.message).to.equal('Usuario no encontrado')
      }
    })

    it('debería lanzar AuthError si la contraseña es incorrecta', async () => {
      const user = {
        _id: { toString: () => 'userId123' },
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      findOneStub.resolves(user)
      compareStub.resolves(false)

      try {
        await loginUser('test@example.com', 'wrongpassword')
        expect.fail('Debería haber lanzado AuthError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthError)
        expect(error.message).to.equal('Credenciales inválidas')
      }
    })

    it('debería lanzar ServerError si findOne falla', async () => {
      findOneStub.rejects(new Error('Database error'))

      try {
        await loginUser('test@example.com', 'password123')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Database error')
      }
    })

    it('debería lanzar ServerError si bcrypt.compare falla', async () => {
      const user = {
        _id: { toString: () => 'userId123' },
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      findOneStub.resolves(user)
      compareStub.rejects(new Error('Compare error'))

      try {
        await loginUser('test@example.com', 'password123')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Compare error')
      }
    })
  })
})