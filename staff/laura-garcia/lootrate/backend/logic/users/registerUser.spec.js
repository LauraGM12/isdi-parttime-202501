import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'
import registerUser from './registerUser.js'

describe('registerUser', () => {
  let findOneStub, hashStub, saveStub, userConstructorStub

  beforeEach(() => {
    findOneStub = sinon.stub(data.users, 'findOne')
    hashStub = sinon.stub(bcrypt, 'hash')
    saveStub = sinon.stub()
    userConstructorStub = sinon.stub(data, 'users').returns({ save: saveStub })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería registrar un usuario correctamente', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      }
      const hashedPassword = 'hashedPassword123'
      const savedUser = { _id: 'userId123', ...userData, password: hashedPassword }

      findOneStub.resolves(null)
      hashStub.resolves(hashedPassword)
      saveStub.resolves(savedUser)

      const result = await registerUser(userData.email, userData.password, userData.username)

      expect(findOneStub.calledOnceWith({ email: userData.email })).to.be.true
      expect(hashStub.calledOnceWith(userData.password, 5)).to.be.true
      expect(userConstructorStub.calledOnceWith({
        email: userData.email,
        password: hashedPassword,
        username: userData.username
      })).to.be.true
      expect(saveStub.calledOnce).to.be.true
      expect(result).to.equal(savedUser)
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar DuplicityError si el usuario ya existe', async () => {
      const existingUser = { _id: 'existingId', email: 'test@example.com' }
      findOneStub.resolves(existingUser)

      try {
        await registerUser('test@example.com', 'password123', 'testuser')
        expect.fail('Debería haber lanzado DuplicityError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.DuplicityError)
        expect(error.message).to.equal('el usuario ya existe')
      }
    })

    it('debería lanzar ServerError si findOne falla', async () => {
      findOneStub.rejects(new Error('Database error'))

      try {
        await registerUser('test@example.com', 'password123', 'testuser')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Database error')
      }
    })

    it('debería lanzar ServerError si bcrypt.hash falla', async () => {
      findOneStub.resolves(null)
      hashStub.rejects(new Error('Hash error'))

      try {
        await registerUser('test@example.com', 'password123', 'testuser')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Hash error')
      }
    })

    it('debería lanzar ServerError si save falla', async () => {
      findOneStub.resolves(null)
      hashStub.resolves('hashedPassword')
      saveStub.rejects(new Error('Save error'))

      try {
        await registerUser('test@example.com', 'password123', 'testuser')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Save error')
      }
    })
  })
})