import { describe, it, expect } from '@jest/globals'
import * as userLogic from './index.js'

describe('Índice de Lógica de Usuarios', () => {
  it('debería exportar todas las funciones de lógica de usuarios', () => {
    expect(userLogic.registerUser).toBeDefined()
    expect(userLogic.loginUser).toBeDefined()
    expect(userLogic.getProfile).toBeDefined()
    expect(userLogic.updateProfile).toBeDefined()
    expect(userLogic.addToGameList).toBeDefined()
    expect(userLogic.removeFromGameList).toBeDefined()
    expect(userLogic.getGameList).toBeDefined()
  })
})