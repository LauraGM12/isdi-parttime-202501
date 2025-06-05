import { describe, it, expect, beforeEach } from '@jest/globals'
import registerUser from './registerUser.js'
import { data } from '../../data/index.js'

// Suite de tests para la función registerUser
describe('registerUser', () => {
  // Antes de cada test, limpiamos la base de datos
  beforeEach(async () => {
    // Eliminamos todos los usuarios de la base de datos de prueba
    await data.users.deleteMany({})
  })

  // Test: registro exitoso de un nuevo usuario
  it('debería registrar un usuario correctamente', async () => {
    // Ejecutamos la función con parámetros válidos (email, password, username)
    const result = await registerUser('registeruser@aprobado.com', 'password1234', 'testuser')
    
    // Verificamos que el resultado existe
    expect(result).toBeDefined()
    // Verificamos que el usuario fue creado con los datos correctos
    expect(result.username).toBe('testuser')
    expect(result.email).toBe('registeruser@aprobado.com')
    // Verificamos que la contraseña está encriptada (no es la original)
    expect(result.password).not.toBe('password1234')
    // Verificamos que la contraseña encriptada existe
    expect(result.password).toBeDefined()
  })

  // Test: fallo por email duplicado
  it('debería fallar con email duplicado', async () => {
    // Registramos el primer usuario
    await registerUser('registeruser@aprobado.com', 'password1234', 'testuser1')
    
    // Intentamos registrar otro usuario con el mismo email
    await expect(
      registerUser('registeruser@aprobado.com', 'password456', 'testuser2')
    ).rejects.toThrow('user already exists')
  })

  // Test: verificar que la contraseña se encripta correctamente
  it('debería encriptar la contraseña', async () => {
    const originalPassword = 'password1234'
    // Registramos un usuario
    const result = await registerUser('registeruser@aprobado.com', originalPassword, 'testuser')
    
    // Verificamos que la contraseña almacenada no es la original
    expect(result.password).not.toBe(originalPassword)
    // Verificamos que la contraseña encriptada tiene la longitud esperada de bcrypt
    expect(result.password.length).toBeGreaterThan(50)
  })
})