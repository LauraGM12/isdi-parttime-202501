import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import getProfile from './getProfile.js'
import { data } from '../../data/index.js'
import { errors } from 'common'


describe('getProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findById = jest.fn()
  })

  it('debería devolver el perfil del usuario sin contraseña', async () => {
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    }

    data.users.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    })

    const result = await getProfile('user123')

    expect(data.users.findById).toHaveBeenCalledWith('user123')

    expect(data.users.findById().select).toHaveBeenCalledWith('-password')

    expect(result).toEqual(mockUser)
  })

  it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
    data.users.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    })

    await expect(getProfile('user123')).rejects.toThrow('usuario no encontrado')
  })
})