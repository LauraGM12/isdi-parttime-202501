import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import updateProfile from './updateProfile.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

const selectMock = jest.fn()
const findByIdAndUpdateMock = jest.fn()

jest.mock('../../data/index.js', () => ({
  data: {
    users: {
      findByIdAndUpdate: jest.fn()
    }
  }
}))

jest.mock('common', () => {
  const originalModule = jest.requireActual('common')
  return {
    ...originalModule
  }
})

describe('updateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    findByIdAndUpdateMock.mockReturnValue({
      select: selectMock
    })
    
    data.users.findByIdAndUpdate = findByIdAndUpdateMock
  })

  it('debería actualizar el perfil de usuario con campos válidos', async () => {
    const updatedUser = {
      _id: '507f1f77bcf86cd799439011', 
      username: 'newUsername',
      email: 'new@email.com'
    }

    selectMock.mockResolvedValue(updatedUser)

    const updateData = {
      username: 'newUsername',
      email: 'new@email.com',
      bio: 'New bio'
    }

    const result = await updateProfile('507f1f77bcf86cd799439011', updateData)

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      updateData,
      { new: true, runValidators: true }
    )

    expect(selectMock).toHaveBeenCalledWith('-password')
    expect(result).toEqual(updatedUser)
  })

  it('debería filtrar campos no permitidos', async () => {
    const updatedUser = { 
      _id: '507f1f77bcf86cd799439011', 
      username: 'newUsername' 
    }
    
    selectMock.mockResolvedValue(updatedUser)

    const updateData = {
      username: 'newUsername',
      password: 'newPassword', 
      invalidField: 'value'    
    }

    await updateProfile('507f1f77bcf86cd799439011', updateData)

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      { username: 'newUsername' }, 
      expect.any(Object)
    )
  })

  it('debería lanzar ValidationError si no hay campos válidos para actualizar', () => {
    const updateData = {
      invalidField: 'value',
      anotherInvalid: 'test'
    }
  
    expect(() => updateProfile('507f1f77bcf86cd799439011', updateData))
      .toThrow(errors.ValidationError)
  })

  it('debería lanzar ExistenceError si el usuario no es encontrado', async () => {
    selectMock.mockResolvedValue(null)

    await expect(updateProfile('507f1f77bcf86cd799439011', { username: 'newUsername' }))
      .rejects.toThrow(errors.ExistenceError)
  })

  it('debería lanzar DuplicityError cuando username o email ya existen', async () => {
    const duplicateError = new Error('Duplicate key error')
    duplicateError.code = 11000
    
    selectMock.mockRejectedValue(duplicateError)

    await expect(updateProfile('507f1f77bcf86cd799439011', { username: 'existing' }))
      .rejects.toThrow(errors.DuplicityError)
  })

  it('debería lanzar ServerError para otros errores de base de datos', async () => {
    const dbError = new Error('Database connection failed')
    
    selectMock.mockRejectedValue(dbError)

    await expect(updateProfile('507f1f77bcf86cd799439011', { username: 'new' }))
      .rejects.toThrow(errors.ServerError)
  })
})