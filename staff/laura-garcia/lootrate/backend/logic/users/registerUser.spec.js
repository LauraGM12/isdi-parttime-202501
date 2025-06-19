import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import registerUser from './registerUser.js'
import { data } from '../../data/index.js'
import bcrypt from 'bcrypt'
import { errors } from 'common'

// Mock de los módulos
jest.mock('../../data/index.js')
jest.mock('bcrypt')

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Configurar los mocks necesarios
    data.users.findOne = jest.fn()
    bcrypt.hash = jest.fn()
  })

  it('debería registrar un nuevo usuario exitosamente', async () => {
    // En el test "debería registrar un nuevo usuario exitosamente"
    
    // Mock para usuario no encontrado (email no existe)
    data.users.findOne.mockResolvedValue(null)
    
    // Mock para hash de contraseña
    bcrypt.hash.mockResolvedValue('hashedPassword123')
    
    // Mock para el nuevo usuario
    const mockSave = jest.fn().mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      username: 'testuser'
    })
    
    // Mock del constructor de usuarios - corregido
    const mockUserInstance = { save: mockSave }
    const originalUsers = data.users;
    data.users = jest.fn(() => mockUserInstance)
    data.users.findOne = originalUsers.findOne; // Mantener la referencia al mock de findOne
    
    // Ejecutar la función
    await registerUser('test@example.com', 'password123', 'testuser')
    
    // Verificar que se llamó a findOne con el email correcto
    expect(data.users.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    
    // Verificar que se llamó a bcrypt.hash con la contraseña y el factor de costo
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 5)
    
    // Verificar que se creó un nuevo usuario con los datos correctos
    expect(data.users).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashedPassword123',
      username: 'testuser'
    })
    
    // Verificar que se llamó a save
    expect(mockSave).toHaveBeenCalled()
  })

  it('debería lanzar DuplicityError si el usuario ya existe', async () => {
    // Mock para usuario encontrado (email ya existe)
    data.users.findOne.mockResolvedValue({
      _id: 'existingUser',
      email: 'test@example.com'
    })
    
    // Verificar que se lanza el error correcto
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('el usuario ya existe')
    
    // Verificar que no se llamó a bcrypt.hash
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it('debería lanzar ServerError si la operación findOne de la base de datos falla', async () => {
    // Mock para error en findOne
    data.users.findOne.mockRejectedValue(new Error('Error de base de datos'))
    
    // Verificar que se lanza el error correcto
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de base de datos')
  })

  it('debería lanzar ServerError si la operación hash de bcrypt falla', async () => {
    // Mock para usuario no encontrado
    data.users.findOne.mockResolvedValue(null)
    
    // Mock para error en hash
    bcrypt.hash.mockRejectedValue(new Error('Error de Bcrypt'))
    
    // Verificar que se lanza el error correcto
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de Bcrypt')
  })

  it('debería lanzar ServerError si la operación save falla', async () => {
    // Mock para usuario no encontrado
    data.users.findOne.mockResolvedValue(null)
    
    // Mock para hash exitoso
    bcrypt.hash.mockResolvedValue('hashedPassword123')
    
    // Mock para error en save
    const mockSave = jest.fn().mockRejectedValue(new Error('Error de guardado'))
    const mockUserInstance = { save: mockSave }
    const originalUsers = data.users;
    data.users = jest.fn(() => mockUserInstance)
    data.users.findOne = originalUsers.findOne; // Mantener la referencia al mock de findOne
    
    // Verificar que se lanza el error correcto
    await expect(registerUser('test@example.com', 'password123', 'testuser'))
      .rejects.toThrow('Error de guardado')
  })
})