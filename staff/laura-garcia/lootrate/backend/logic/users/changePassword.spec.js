import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'
import changePassword from './changePassword.js'

describe('changePassword', () => {
  let findByIdStub, compareStub, hashStub, saveStub

  beforeEach(() => {
    findByIdStub = sinon.stub(data.users, 'findById')
    compareStub = sinon.stub(bcrypt, 'compare')
    hashStub = sinon.stub(bcrypt, 'hash')
    saveStub = sinon.stub()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería cambiar la contraseña correctamente', async () => {
      const userId = 'userId123'
      const currentPassword = 'oldpassword'
      const newPassword = 'newpassword'
      const hashedNewPassword = 'hashedNewPassword'
      const user = {
        _id: userId,
        password: 'hashedOldPassword',
        save: saveStub
      }

      findByIdStub.resolves(user)
      compareStub.resolves(true)
      hashStub.resolves(hashedNewPassword)
      saveStub.resolves()

      const result = await changePassword(userId, currentPassword, newPassword)

      expect(findByIdStub.calledOnceWith(userId)).to.be.true
      expect(compareStub.calledOnceWith(currentPassword, 'hashedOldPassword')).to.be.true
      expect(hashStub.calledOnceWith(newPassword, 10)).to.be.true
      expect(user.password).to.equal(hashedNewPassword)
      expect(saveStub.calledOnce).to.be.true
      expect(result).to.deep.equal({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      })
    })
  })

  describe('validaciones y errores', () => {
    it('debería lanzar ExistenceError si el usuario no existe', async () => {
      findByIdStub.resolves(null)

      try {
        await changePassword('nonexistentId', 'oldpass', 'newpass')
        expect.fail('Debería haber lanzado ExistenceError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ExistenceError)
        expect(error.message).to.equal('Usuario no encontrado')
      }
    })

    it('debería lanzar AuthError si la contraseña actual es incorrecta', async () => {
      const user = {
        _id: 'userId123',
        password: 'hashedPassword'
      }

      findByIdStub.resolves(user)
      compareStub.resolves(false)

      try {
        await changePassword('userId123', 'wrongpassword', 'newpassword')
        expect.fail('Debería haber lanzado AuthError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthError)
        expect(error.message).to.equal('La contraseña actual es incorrecta')
      }
    })

    it('debería lanzar ServerError si findById falla', async () => {
      findByIdStub.rejects(new Error('Database error'))

      try {
        await changePassword('userId123', 'oldpass', 'newpass')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Database error')
      }
    })

    it('debería lanzar ServerError si bcrypt.compare falla', async () => {
      const user = { _id: 'userId123', password: 'hashedPassword' }
      findByIdStub.resolves(user)
      compareStub.rejects(new Error('Compare error'))

      try {
        await changePassword('userId123', 'oldpass', 'newpass')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Compare error')
      }
    })

    it('debería lanzar ServerError si bcrypt.hash falla', async () => {
      const user = { _id: 'userId123', password: 'hashedPassword' }
      findByIdStub.resolves(user)
      compareStub.resolves(true)
      hashStub.rejects(new Error('Hash error'))

      try {
        await changePassword('userId123', 'oldpass', 'newpass')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Hash error')
      }
    })

    it('debería lanzar ServerError si save falla', async () => {
      const user = {
        _id: 'userId123',
        password: 'hashedPassword',
        save: saveStub
      }
      findByIdStub.resolves(user)
      compareStub.resolves(true)
      hashStub.resolves('newHashedPassword')
      saveStub.rejects(new Error('Save error'))

      try {
        await changePassword('userId123', 'oldpass', 'newpass')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Save error')
      }
    })
  })
})