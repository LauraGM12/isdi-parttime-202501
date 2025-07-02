import { describe, it, expect } from '@jest/globals'
import * as logic from './index.js'

describe('logic/index.js', () => {
  it('debería exportar todos los módulos necesarios', () => {
    expect(logic).toBeDefined()
    expect(logic.users).toBeDefined()
    expect(logic.games).toBeDefined()
  })
})