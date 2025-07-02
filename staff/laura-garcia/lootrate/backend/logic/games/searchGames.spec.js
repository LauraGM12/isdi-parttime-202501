import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { searchGames } from './searchGames.js'

jest.mock('./rawgService.js', () => ({
  searchGames: jest.fn()
}))

import { searchGames as rawgSearchGames } from './rawgService.js'

describe('searchGames', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería buscar juegos correctamente', async () => {
    rawgSearchGames.mockResolvedValue({
      results: [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }],
      count: 2,
      next: 'next-page-url',
      previous: null
    })
    
    const result = await searchGames('zelda', 1)
    
    expect(rawgSearchGames).toHaveBeenCalledWith('zelda', 1)
    expect(result.query).toBe('zelda')
    expect(result.results).toHaveLength(2)
  })

  it('debería fallar con query vacía', async () => {
    await expect(searchGames('')).rejects.toThrow('Search query is required')
    expect(rawgSearchGames).not.toHaveBeenCalled()
  })

  it('debería fallar con página inválida', async () => {
    await expect(searchGames('zelda', 0)).rejects.toThrow('Page must be greater than 0')
    expect(rawgSearchGames).not.toHaveBeenCalled()
  })

  it('debería manejar errores del servicio correctamente', async () => {
    rawgSearchGames.mockRejectedValue(new Error('API error'))
    
    await expect(searchGames('zelda', 1)).rejects.toThrow('Error searching games')
  })

  it('debería manejar respuestas vacías correctamente', async () => {
    rawgSearchGames.mockResolvedValue({})
    
    const result = await searchGames('zelda', 1)
    
    expect(result.results).toEqual([])
    expect(result.count).toBe(0)
  })

  it('debería hacer trim de la query correctamente', async () => {
    rawgSearchGames.mockResolvedValue({
      results: [{ id: 1, name: 'Game 1' }],
      count: 1
    })
    
    const result = await searchGames('  zelda  ', 1)
    
    expect(rawgSearchGames).toHaveBeenCalledWith('  zelda  ', 1)
    expect(result.query).toBe('zelda')
  })
})