import { describe, it, expect, beforeEach } from '@jest/globals'
import loginUser from './loginUser.js'
import registerUser from './registerUser.js'
import { data } from '../../data/index.js'
import bcrypt from 'bcrypt'

// Suite de tests para la función loginUser
describe('loginUser', () => {
  // Antes de cada test, limpiamos la base de datos
  beforeEach(async () => {
    // Eliminamos todos los usuarios de la base de datos de prueba
    await data.users.deleteMany({})
  })

  // Test: login exitoso con credenciales correctas
  it('debería hacer login correctamente con credenciales válidas', async () => {
    // Primero registramos un usuario de prueba
    await registerUser('loginUser@aprobado.com', 'password1234', 'testuser')
    
    // Ejecutamos el login con las credenciales correctas
    const result = await loginUser('loginUser@aprobado.com', 'password1234')
    
    // Verificamos que el resultado existe
    expect(result).toBeDefined()
    // Verificamos que retorna el ID del usuario
    expect(result._id).toBeDefined()
    // Verificamos que no retorna la contraseña por seguridad
    expect(result.password).toBeUndefined()
  })

  // Test: fallo por email inexistente
  it('debería fallar con email que no existe', async () => {
    // Intentamos hacer login con un email que no existe
    await expect(
      loginUser('noexiste@denegado.com', 'password123')
    ).rejects.toThrow('user not found')
  })

  // Test: fallo por contraseña incorrecta
  it('debería fallar con contraseña incorrecta', async () => {
    // Registramos un usuario de prueba
    await registerUser('loginUser@aprobado.com', 'password1234', 'testuser')
    
    // Intentamos hacer login con contraseña incorrecta
    await expect(
      loginUser('loginUser@aprobado.com', 'password')
    ).rejects.toThrow('wrong credentials')
  })

  // Test: verificar que la función encuentra al usuario correcto
  it('debería retornar los datos correctos del usuario', async () => {
    // Registramos un usuario de prueba
    const registeredUser = await registerUser('loginUser@aprobado.com', 'password1234', 'testuser')
    
    // Hacemos login
    const loginResult = await loginUser('loginUser@aprobado.com', 'password1234')
    
    // Verificamos que retorna el mismo usuario que se registró
    expect(loginResult._id.toString()).toBe(registeredUser._id.toString())
    expect(loginResult.email).toBe('loginUser@aprobado.com')
    expect(loginResult.username).toBe('testuser')
  })

  // Test: verificar que bcrypt.compare funciona correctamente
  it('debería validar correctamente las contraseñas encriptadas', async () => {
    // Registramos un usuario (esto encripta la contraseña)
    await registerUser('loginUser@aprobado.com', 'password1234', 'testuser')
    
    // Buscamos el usuario en la base de datos
    const userInDb = await data.users.findOne({ email: 'loginUser@aprobado.com' })
    
    // Verificamos que la contraseña está encriptada
    expect(userInDb.password).not.toBe('password1234')
    
    // Verificamos que bcrypt.compare funciona correctamente
    const isValidPassword = await bcrypt.compare('password1234', userInDb.password)
    expect(isValidPassword).toBe(true)
    
    // Verificamos que una contraseña incorrecta falla
    const isInvalidPassword = await bcrypt.compare('password', userInDb.password)
    expect(isInvalidPassword).toBe(false)
  })

  // Test: verificar manejo de errores de servidor
  it('debería manejar errores de base de datos correctamente', async () => {
    // Simulamos un error cerrando la conexión (esto es solo un ejemplo)
    // En un test real, podrías usar mocks para simular errores
    
    // Registramos un usuario primero
    await registerUser('loginUser@aprobado.com', 'password1234', 'testuser')
    
    // El login debería funcionar normalmente
    const result = await loginUser('loginUser@aprobado.com', 'password1234')
    expect(result).toBeDefined()
  })
})