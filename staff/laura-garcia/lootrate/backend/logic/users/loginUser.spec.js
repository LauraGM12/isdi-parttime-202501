import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import loginUser from './loginUser.js'
import { data } from '../../data/index.js'
import bcrypt from 'bcryptjs'
import { errors } from 'common'


jest.mock('bcryptjs')

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findOne = jest.fn()
    bcrypt.compare = jest.fn()
  })

  it('debería devolver el ID del usuario cuando el inicio de sesión es exitoso', async () => {
    const mockUser = {
      _id: { toString: () => 'user123' },
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)

    const result = await loginUser('test@example.com', 'password123')

    expect(data.users.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')

    expect(result).toBe('user123')
  })

  it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
    data.users.findOne.mockResolvedValue(null)

    await expect(loginUser('nonexistent@example.com', 'password123'))
      .rejects.toThrow('user not found')
  })

  it('debería lanzar AuthError si la contraseña es incorrecta', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(false)

    await expect(loginUser('test@example.com', 'wrongPassword'))
      .rejects.toThrow('invalid credentials')
  })

  it('debería lanzar ServerError si la operación de base de datos falla', async () => {
    data.users.findOne.mockRejectedValue(new Error('Database error'))

    await expect(loginUser('test@example.com', 'password123'))
      .rejects.toThrow('Database error')
  })

  it('debería lanzar ServerError si la operación de bcrypt falla', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword'
    }

    data.users.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'))

    await expect(loginUser('test@example.com', 'password123'))
      .rejects.toThrow('Bcrypt error')
  })
})