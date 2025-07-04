import { jest, describe, beforeEach, it, expect } from '@jest/globals'

const rawgSearchGamesMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  searchGames: rawgSearchGamesMock
}))

jest.mock('common', () => ({
  errors: {
    ValidationError: class ValidationError extends Error {
      constructor(message) {
        super(message)
        this.name = 'ValidationError'
      }
    },
    ServerError: class ServerError extends Error {
      constructor(message) {
        super(message)
        this.name = 'ServerError'
      }
    }
  }
}))

import { searchGames } from './searchGames.js'
import { errors } from 'common'

describe('searchGames', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('debería buscar juegos correctamente', async () => {
    rawgSearchGamesMock.mockResolvedValue({
      results: [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }],
      count: 2,
      next: 'next-page-url',
      previous: null
    })
    
    const result = await searchGames('zelda', 1)
    
    expect(rawgSearchGamesMock).toHaveBeenCalledWith('zelda', 1)
    expect(result.query).toBe('zelda')
    expect(result.results).toHaveLength(2)
    expect(result.page).toBe(1)
    expect(result.count).toBe(2)
  })

  it('debería fallar con query vacía', async () => {
    await expect(searchGames('')).rejects.toThrow(errors.ValidationError)
    await expect(searchGames('')).rejects.toThrow('La consulta de búsqueda es requerida')
    expect(rawgSearchGamesMock).not.toHaveBeenCalled()
  })

  it('debería fallar con query null', async () => {
    await expect(searchGames(null)).rejects.toThrow(errors.ValidationError)
    await expect(searchGames(null)).rejects.toThrow('La consulta de búsqueda es requerida')
    expect(rawgSearchGamesMock).not.toHaveBeenCalled()
  })

  it('debería fallar con página inválida', async () => {
    await expect(searchGames('zelda', 0)).rejects.toThrow(errors.ValidationError)
    await expect(searchGames('zelda', 0)).rejects.toThrow('La página debe ser mayor a 0')
    expect(rawgSearchGamesMock).not.toHaveBeenCalled()
  })

  it('debería manejar errores del servicio correctamente', async () => {
    rawgSearchGamesMock.mockRejectedValue(new Error('API error'))
    
    await expect(searchGames('zelda', 1)).rejects.toThrow(errors.ServerError)
    await expect(searchGames('zelda', 1)).rejects.toThrow('Error al buscar juegos')
  })

  it('debería manejar respuestas vacías correctamente', async () => {
    rawgSearchGamesMock.mockResolvedValue({})
    
    const result = await searchGames('zelda', 1)
    
    expect(result.results).toEqual([])
    expect(result.count).toBe(0)
    expect(result.query).toBe('zelda')
  })

  it('debería hacer trim de la query correctamente', async () => {
    rawgSearchGamesMock.mockResolvedValue({
      results: [{ id: 1, name: 'Game 1' }],
      count: 1
    })
    
    const result = await searchGames('  zelda  ', 1)
    
    expect(rawgSearchGamesMock).toHaveBeenCalledWith('  zelda  ', 1)
    expect(result.query).toBe('zelda')
  })

  it('debería manejar ValidationError correctamente', async () => {
    const validationError = new errors.ValidationError('Error de validación')
    rawgSearchGamesMock.mockRejectedValue(validationError)
    
    await expect(searchGames('zelda', 1)).rejects.toThrow(errors.ValidationError)
    await expect(searchGames('zelda', 1)).rejects.toThrow('Error de validación')
  })
})