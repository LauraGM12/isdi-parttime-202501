import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import changePassword from './changePassword.js'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'


jest.mock('bcryptjs')
jest.mock('../../data/index.js')

describe('changePassword', () => {
  let findByIdMock;

  beforeEach(() => {
    jest.clearAllMocks()
    
    findByIdMock = jest.fn();
    data.users.findById = findByIdMock;
    
    bcrypt.compare = jest.fn();
    bcrypt.hash = jest.fn();
  })

  it('debería lanzar ExistenceError si el usuario no existe', async () => {
    findByIdMock.mockResolvedValue(null)

    await expect(changePassword('id', 'old', 'new')).rejects.toThrow(errors.ExistenceError)
  })

  it('debería lanzar AuthError si la contraseña actual no es válida', async () => {
    const user = { password: 'hash' }
    findByIdMock.mockResolvedValue(user)
    bcrypt.compare.mockResolvedValue(false)

    await expect(changePassword('id', 'wrong', 'new')).rejects.toThrow(errors.AuthError)
  })

  it('debería cambiar la contraseña correctamente', async () => {
    const user = {
      password: 'hash',
      save: jest.fn().mockResolvedValue()
    }

    findByIdMock.mockResolvedValue(user)
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockResolvedValue('newHash')

    const result = await changePassword('id', 'correct', 'newPass')

    expect(user.password).toBe('newHash')
    expect(user.save).toHaveBeenCalled()
    expect(result).toEqual({ success: true, message: 'Contraseña cambiada exitosamente' })
  })

  it('debería lanzar ServerError si falla findById', async () => {
    findByIdMock.mockRejectedValue(new Error('DB error'))

    await expect(changePassword('id', 'old', 'new')).rejects.toThrow(errors.ServerError)
  })

  it('debería lanzar ServerError si falla bcrypt.compare', async () => {
    const user = { password: 'hash' }
    findByIdMock.mockResolvedValue(user)
    bcrypt.compare.mockRejectedValue(new Error('Compare error'))

    await expect(changePassword('id', 'old', 'new')).rejects.toThrow(errors.ServerError)
  })

  it('debería lanzar ServerError si falla bcrypt.hash', async () => {
    const user = { password: 'hash' }
    findByIdMock.mockResolvedValue(user)
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockRejectedValue(new Error('Hash fail'))

    await expect(changePassword('id', 'old', 'new')).rejects.toThrow(errors.ServerError)
  })

  it('debería lanzar ServerError si falla user.save()', async () => {
    const user = {
      password: 'hash',
      save: jest.fn().mockRejectedValue(new Error('Save error'))
    }

    findByIdMock.mockResolvedValue(user)
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockResolvedValue('newHash')

    await expect(changePassword('id', 'old', 'new')).rejects.toThrow(errors.ServerError)
  })
})
