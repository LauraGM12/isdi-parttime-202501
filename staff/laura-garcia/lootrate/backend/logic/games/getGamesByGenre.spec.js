import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { getGamesByGenre } from './getGamesByGenre.js'

jest.mock('./rawgService.js', () => ({
  getGamesByGenre: jest.fn()
}))

import { getGamesByGenre as rawgGetGamesByGenre } from './rawgService.js'

describe('getGamesByGenre', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería obtener juegos por género correctamente', async () => {
    const mockResponse = {
      results: [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }],
      count: 2,
      next: 'next-page-url',
      previous: null
    }
    
    rawgGetGamesByGenre.mockResolvedValue(mockResponse)
    
    const result = await getGamesByGenre('action', 1)
    
    expect(rawgGetGamesByGenre).toHaveBeenCalledWith('action', 1)
    
    expect(result).toEqual({
      genre: 'action',
      page: 1,
      results: mockResponse.results,
      count: mockResponse.count,
      next: mockResponse.next,
      previous: mockResponse.previous
    })
  })

  it('debería fallar con género vacío', async () => {
    await expect(getGamesByGenre('')).rejects.toThrow('El slug del género es requerido')
    
    expect(rawgGetGamesByGenre).not.toHaveBeenCalled()
  })

  it('debería fallar con página inválida', async () => {
    await expect(getGamesByGenre('action', 0)).rejects.toThrow('La página debe ser mayor a 0')
    
    expect(rawgGetGamesByGenre).not.toHaveBeenCalled()
  })

  it('debería manejar errores del servicio correctamente', async () => {
    rawgGetGamesByGenre.mockRejectedValue(new Error('Error de API'))
    
    await expect(getGamesByGenre('action', 1)).rejects.toThrow('Error al obtener juegos por género')
  })

  it('debería manejar respuestas vacías correctamente', async () => {
    rawgGetGamesByGenre.mockResolvedValue({})
    
    const result = await getGamesByGenre('action', 1)
    
    expect(result).toEqual({
      genre: 'action',
      page: 1,
      results: [],
      count: 0,
      next: undefined,
      previous: undefined
    })
  })
})