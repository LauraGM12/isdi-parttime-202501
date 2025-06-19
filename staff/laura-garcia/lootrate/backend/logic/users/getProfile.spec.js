import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import getProfile from './getProfile.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

// Mock del módulo data
jest.mock('../../data/index.js')

describe('getProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findById = jest.fn()
  })

  it('debería devolver el perfil del usuario sin contraseña', async () => {
    // Mock del usuario
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    }

    // Configurar mock para simular usuario encontrado
    data.users.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    })

    // Ejecutar la función
    const result = await getProfile('user123')

    // Verificar que se llamó a findById con el ID correcto
    expect(data.users.findById).toHaveBeenCalledWith('user123')

    // Verificar que se llamó a select para excluir la contraseña
    expect(data.users.findById().select).toHaveBeenCalledWith('-password')

    // Verificar el resultado
    expect(result).toEqual(mockUser)
  })

  it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
    // Configurar mock para simular usuario no encontrado
    data.users.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    })

    // Verificar que se lanza el error correcto
    await expect(getProfile('user123')).rejects.toThrow('user not found')
  })

  it('debería lanzar ServerError si la operación de base de datos falla', async () => {
    // Configurar mock para simular error de base de datos
    data.users.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    })

    // Verificar que se lanza el error correcto
    await expect(getProfile('user123')).rejects.toThrow('Database error')
  })
})