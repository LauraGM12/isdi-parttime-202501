import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import registerUser from './registerUser.js'
import { data } from '../../data/index.js'
import bcrypt from 'bcryptjs'
import { errors } from 'common'

jest.mock('../../data/index.js')
jest.mock('bcrypt')

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    data.users.findOne = jest.fn()
    bcrypt.hash = jest.fn()
  })

  it('debería registrar un nuevo usuario exitosamente', async () => {
    
    data.users.findOne.mockResolvedValue(null)
    
    bcrypt.hash.mockResolvedValue('hashedPassword123')
    
    const mockSave = jest.fn().mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      username: 'testuser'
    })
    
    const mockUserInstance = { save: mockSave }
    const originalUsers = data.users;
    data.users = jest.fn(() => mockUserInstance)
    data.users.findOne = originalUsers.findOne; 
    
    await registerUser('test@example.com', 'password123', 'testuser')
    
    expect(data.users.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 5)
    
    expect(data.users).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashedPassword123',
      username: 'testuser'
    })
    
    expect(mockSave).toHaveBeenCalled()
  })

  it('debería lanzar DuplicityError si el usuario ya existe', async () => {
    data.users.findOne.mockResolvedValue({
      _id: 'existingUser',
      email: 'test@example.com'
    })
    
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('el usuario ya existe')
    
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it('debería lanzar ServerError si la operación findOne de la base de datos falla', async () => {
    data.users.findOne.mockRejectedValue(new Error('Error de base de datos'))
    
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de base de datos')
  })

  it('debería lanzar ServerError si la operación hash de bcrypt falla', async () => {
    data.users.findOne.mockResolvedValue(null)
    
    bcrypt.hash.mockRejectedValue(new Error('Error de Bcrypt'))
    
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de Bcrypt')
  })

  it('debería lanzar ServerError si la operación save falla', async () => {
    data.users.findOne.mockResolvedValue(null)
    
    bcrypt.hash.mockResolvedValue('hashedPassword123')
    
    const mockSave = jest.fn().mockRejectedValue(new Error('Error de guardado'))
    const mockUserInstance = { save: mockSave }
    const originalUsers = data.users;
    data.users = jest.fn(() => mockUserInstance)
    data.users.findOne = originalUsers.findOne; 
    
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de guardado')
  })
})