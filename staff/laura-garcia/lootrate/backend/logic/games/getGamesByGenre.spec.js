import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { getGamesByGenre } from './getGamesByGenre.js'

// Mock del módulo rawgService - simular la función específica
jest.mock('./rawgService.js', () => ({
  getGamesByGenre: jest.fn()
}))

// Importar el mock después de configurarlo
import { getGamesByGenre as rawgGetGamesByGenre } from './rawgService.js'

describe('getGamesByGenre', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks()
  })

  it('debería obtener juegos por género correctamente', async () => {
    // Respuesta simulada del servicio RAWG
    const mockResponse = {
      results: [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }],
      count: 2,
      next: 'next-page-url',
      previous: null
    }
    
    // Configurar el mock para devolver la respuesta simulada
    rawgGetGamesByGenre.mockResolvedValue(mockResponse)
    
    // Ejecutar la función bajo prueba
    const result = await getGamesByGenre('action', 1)
    
    // Verificar que el servicio fue llamado con los parámetros correctos
    expect(rawgGetGamesByGenre).toHaveBeenCalledWith('action', 1)
    
    // Verificar que el resultado tiene la estructura esperada
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
    // Verificar que se lanza un error cuando el género está vacío
    await expect(getGamesByGenre('')).rejects.toThrow('El slug del género es requerido')
    
    // Verificar que el servicio no fue llamado
    expect(rawgGetGamesByGenre).not.toHaveBeenCalled()
  })

  it('debería fallar con página inválida', async () => {
    // Verificar que se lanza un error cuando la página es menor a 1
    await expect(getGamesByGenre('action', 0)).rejects.toThrow('La página debe ser mayor a 0')
    
    // Verificar que el servicio no fue llamado
    expect(rawgGetGamesByGenre).not.toHaveBeenCalled()
  })

  it('debería manejar errores del servicio correctamente', async () => {
    // Configurar el mock para rechazar con un error
    rawgGetGamesByGenre.mockRejectedValue(new Error('Error de API'))
    
    // Verificar que se propaga el error correctamente
    await expect(getGamesByGenre('action', 1)).rejects.toThrow('Error al obtener juegos por género')
  })

  it('debería manejar respuestas vacías correctamente', async () => {
    // Configurar el mock para devolver una respuesta vacía
    rawgGetGamesByGenre.mockResolvedValue({})
    
    // Ejecutar la función bajo prueba
    const result = await getGamesByGenre('action', 1)
    
    // Verificar que se manejan correctamente los valores por defecto
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