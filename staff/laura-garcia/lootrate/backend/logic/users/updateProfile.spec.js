import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import updateProfile from './updateProfile.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

// Mock del módulo data
jest.mock('../../data/index.js', () => ({
  data: {
    users: {
      findByIdAndUpdate: jest.fn()
    }
  }
}))

describe('updateProfile', () => {
  // En beforeEach
  beforeEach(() => {
    jest.clearAllMocks()
    // Asegúrame de que findByIdAndUpdate es una función mock
    data.users.findByIdAndUpdate = jest.fn()
  })

  it('debería actualizar el perfil de usuario con campos válidos', async () => {
    // Mock del usuario actualizado
    const updatedUser = {
      _id: 'user123',
      username: 'newUsername',
      email: 'new@email.com'
    }

    // Configurar mock para simular actualización exitosa
    data.users.findByIdAndUpdate.mockResolvedValue(updatedUser)

    // Datos para actualizar
    const updateData = {
      username: 'newUsername',
      email: 'new@email.com',
      bio: 'New bio'
    }

    // Ejecutar la función
    const result = await updateProfile('user123', updateData)

    // Verificar que se llamó a findByIdAndUpdate con los parámetros correctos
    expect(data.users.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      updateData,
      { new: true, runValidators: true }
    )

    // Verificar el resultado
    expect(result).toEqual(updatedUser)
  })

  it('debería filtrar campos no permitidos', async () => {
    // Configurar mock
    data.users.findByIdAndUpdate.mockImplementation((id, data) => {
      return Promise.resolve({ _id: id, ...data })
    })

    // Datos para actualizar con campos no permitidos
    const updateData = {
      username: 'newUsername',
      password: 'newPassword', // No permitido
      invalidField: 'value'    // No permitido
    }

    // Ejecutar la función
    await updateProfile('user123', updateData)

    // Verificar que solo se pasaron los campos permitidos
    expect(data.users.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      { username: 'newUsername' },
      expect.any(Object)
    )
  })

  it('debería lanzar ValidationError si no hay campos válidos para actualizar', async () => {
    // Datos para actualizar sin campos válidos
    const updateData = {
      invalidField: 'value'
    }

    // Verificar que se lanza el error correcto
    await expect(updateProfile('user123', updateData))
      .rejects.toThrow('no hay campos válidos para actualizar')
  })

  it('debería lanzar ExistenceError si el usuario no es encontrado', async () => {
    // Configurar mock para simular usuario no encontrado
    data.users.findByIdAndUpdate.mockResolvedValue(null)

    // Verificar que se lanza el error correcto
    await expect(updateProfile('user123', { username: 'newUsername' }))
      .rejects.toThrow('usuario no encontrado')
  })

  it('debería lanzar DuplicityError si el nombre de usuario o email ya existe', async () => {
    // Configurar mock para simular error de duplicidad
    data.users.findByIdAndUpdate.mockRejectedValue({ code: 11000 })

    // Verificar que se lanza el error correcto
    await expect(updateProfile('user123', { username: 'existingUsername' }))
      .rejects.toThrow('el nombre de usuario o email ya existe')
  })

  it('debería lanzar ServerError para otros errores', async () => {
    // Configurar mock para simular error del servidor
    data.users.findByIdAndUpdate.mockRejectedValue(new Error('Error de base de datos'))

    // Verificar que se lanza el error correcto
    await expect(updateProfile('user123', { username: 'newUsername' }))
      .rejects.toThrow('Error de base de datos')
  })
})