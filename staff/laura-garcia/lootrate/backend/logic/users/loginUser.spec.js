import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import loginUser from './loginUser.js'
import { data } from '../../data/index.js'
import bcrypt from 'bcrypt'
import { errors } from 'common'

// Mock de los módulos
jest.mock('../../data/index.js')
jest.mock('bcrypt')

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findOne = jest.fn()
    bcrypt.compare = jest.fn()
  })

  it('debería devolver el ID del usuario cuando el inicio de sesión es exitoso', async () => {
    // Mock del usuario
    const mockUser = {
      _id: { toString: () => 'user123' },
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    // Configurar mocks
    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)

    // Ejecutar la función
    const result = await loginUser('test@example.com', 'password123')

    // Verificar que se llamó a findOne con el email correcto
    expect(data.users.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })

    // Verificar que se llamó a bcrypt.compare con la contraseña y el hash
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')

    // Verificar el resultado
    expect(result).toBe('user123')
  })

  it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
    // Configurar mock para simular usuario no encontrado
    data.users.findOne.mockResolvedValue(null)

    // Verificar que se lanza el error correcto
    await expect(loginUser('nonexistent@example.com', 'password123'))
      .rejects.toThrow('user not found')
  })

  it('debería lanzar AuthError si la contraseña es incorrecta', async () => {
    // Mock del usuario
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    // Configurar mocks
    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(false)

    // Verificar que se lanza el error correcto
    await expect(loginUser('test@example.com', 'wrongPassword'))
      .rejects.toThrow('invalid credentials')
  })

  it('debería lanzar ServerError si la operación de base de datos falla', async () => {
    // Configurar mock para simular error de base de datos
    data.users.findOne.mockRejectedValue(new Error('Database error'))

    // Verificar que se lanza el error correcto
    await expect(loginUser('test@example.com', 'password123'))
      .rejects.toThrow('Database error')
  })

  it('debería lanzar ServerError si la operación de bcrypt falla', async () => {
    // Mock del usuario
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    // Configurar mocks
    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'))

    // Verificar que se lanza el error correcto
    await expect(loginUser('test@example.com', 'password123'))
      .rejects.toThrow('Bcrypt error')
  })
})