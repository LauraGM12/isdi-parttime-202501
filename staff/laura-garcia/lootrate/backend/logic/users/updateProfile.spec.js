import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import updateProfile from './updateProfile.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

jest.mock('../../data/index.js', () => ({
  data: {
    users: {
      findByIdAndUpdate: jest.fn()
    }
  }
}))

describe('updateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findByIdAndUpdate = jest.fn()
  })

  it('debería actualizar el perfil de usuario con campos válidos', async () => {
    const updatedUser = {
      _id: 'user123',
      username: 'newUsername',
      email: 'new@email.com'
    }

    data.users.findByIdAndUpdate.mockResolvedValue(updatedUser)

    const updateData = {
      username: 'newUsername',
      email: 'new@email.com',
      bio: 'New bio'
    }

    const result = await updateProfile('user123', updateData)

    expect(data.users.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      updateData,
      { new: true, runValidators: true }
    )

    expect(result).toEqual(updatedUser)
  })

  it('debería filtrar campos no permitidos', async () => {
    data.users.findByIdAndUpdate.mockImplementation((id, data) => {
      return Promise.resolve({ _id: id, ...data })
    })

    const updateData = {
      username: 'newUsername',
      password: 'newPassword',
      invalidField: 'value'   
    }

    await updateProfile('user123', updateData)

    expect(data.users.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      { username: 'newUsername' },
      expect.any(Object)
    )
  })

  it('debería lanzar ValidationError si no hay campos válidos para actualizar', async () => {
    const updateData = {
      invalidField: 'value'
    }

    await expect(updateProfile('user123', updateData))
      .rejects.toThrow('no hay campos válidos para actualizar')
  })

  it('debería lanzar ExistenceError si el usuario no es encontrado', async () => {
    data.users.findByIdAndUpdate.mockResolvedValue(null)

    await expect(updateProfile('user123', { username: 'newUsername' }))
      .rejects.toThrow('usuario no encontrado')
  })

  it('debería lanzar DuplicityError si el nombre de usuario o email ya existe', async () => {
    data.users.findByIdAndUpdate.mockRejectedValue({ code: 11000 })

    await expect(updateProfile('user123', { username: 'existingUsername' }))
      .rejects.toThrow('el nombre de usuario o email ya existe')
  })

  it('debería lanzar ServerError para otros errores', async () => {
    data.users.findByIdAndUpdate.mockRejectedValue(new Error('Error de base de datos'))

    await expect(updateProfile('user123', { username: 'newUsername' }))
      .rejects.toThrow('Error de base de datos')
  })
})