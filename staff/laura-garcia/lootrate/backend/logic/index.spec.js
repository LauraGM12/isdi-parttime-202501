import { describe, it, expect } from '@jest/globals'
import * as logic from './index.js'

describe('logic/index.js', () => {
  it('debería exportar todos los módulos necesarios', () => {
    // Verifica que todas las exportaciones esperadas existen
    expect(logic).toBeDefined()
    // Añade verificaciones para cada exportación específica
    expect(logic.users).toBeDefined()
    expect(logic.games).toBeDefined()
  })
})