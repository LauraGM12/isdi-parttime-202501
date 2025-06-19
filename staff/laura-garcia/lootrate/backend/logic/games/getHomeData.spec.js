import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { getHomeData } from './getHomeData.js'
import * as rawgService from './rawgService.js'

// Mock del módulo rawgService
jest.mock('./rawgService.js', () => ({
  getFeaturedGames: jest.fn(),
  getGenres: jest.fn(),
  getUpcomingGames: jest.fn(),
  getTrendingGames: jest.fn(),
  getNewReleases: jest.fn(),
  getTopRatedGames: jest.fn()
}))

describe('getHomeData', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks()
    
    // Configurar variables de entorno para las pruebas
    process.env.RAWG_API_KEY = 'test-api-key'
    process.env.RAWG_BASE_URL = 'https://api.rawg.io/api/'
  })

  it('debería retornar datos del home formateados cuando todas las llamadas a la API son exitosas', async () => {
    // Configurar mocks para simular respuestas exitosas
    rawgService.getFeaturedGames.mockResolvedValue({ results: [{ id: 1, name: 'Featured Game' }] })
    rawgService.getGenres.mockResolvedValue({ results: [{ id: 1, name: 'Action' }] })
    rawgService.getUpcomingGames.mockResolvedValue({ results: [{ id: 2, name: 'Upcoming Game' }] })
    rawgService.getTrendingGames.mockResolvedValue({ results: [{ id: 3, name: 'Trending Game' }] })
    rawgService.getNewReleases.mockResolvedValue({ results: [{ id: 4, name: 'New Release' }] })
    rawgService.getTopRatedGames.mockResolvedValue({ results: [{ id: 5, name: 'Top Rated Game' }] })

    // Ejecutar la función bajo prueba
    const result = await getHomeData()

    // Verificar que se llamaron todas las funciones del servicio con los parámetros correctos
    expect(rawgService.getFeaturedGames).toHaveBeenCalledWith(1, 10)
    expect(rawgService.getGenres).toHaveBeenCalled()
    expect(rawgService.getUpcomingGames).toHaveBeenCalledWith(1, 6)
    expect(rawgService.getTrendingGames).toHaveBeenCalledWith(1, 6)
    expect(rawgService.getNewReleases).toHaveBeenCalledWith(1, 6)
    expect(rawgService.getTopRatedGames).toHaveBeenCalledWith(1, 6)

    // Verificar el formato de los datos retornados
    expect(result).toEqual({
      featured: { id: 1, name: 'Featured Game' },
      trending: [{ id: 3, name: 'Trending Game' }],
      newReleases: [{ id: 4, name: 'New Release' }],
      topRated: [{ id: 5, name: 'Top Rated Game' }],
      upcoming: [{ id: 2, name: 'Upcoming Game' }],
      genres: [{ id: 1, name: 'Action' }]
    })
  })

  it('debería manejar resultados vacíos de las llamadas a la API', async () => {
    // Configurar mocks para simular respuestas vacías
    rawgService.getFeaturedGames.mockResolvedValue({ results: [] })
    rawgService.getGenres.mockResolvedValue({ results: [] })
    rawgService.getUpcomingGames.mockResolvedValue({ results: [] })
    rawgService.getTrendingGames.mockResolvedValue({ results: [] })
    rawgService.getNewReleases.mockResolvedValue({ results: [] })
    rawgService.getTopRatedGames.mockResolvedValue({ results: [] })

    // Ejecutar la función bajo prueba
    const result = await getHomeData()

    // Verificar el formato de los datos retornados con arrays vacíos
    expect(result).toEqual({
      featured: null,
      trending: [],
      newReleases: [],
      topRated: [],
      upcoming: [],
      genres: []
    })
  })

  it('debería lanzar ServerError cuando cualquier llamada a la API falla', async () => {
    // Configurar mock para simular un error
    rawgService.getFeaturedGames.mockRejectedValue(new Error('Error de API'))

    // Verificar que se lanza el error correcto, usando una expresión regular
    await expect(getHomeData()).rejects.toThrow(/Error al obtener datos del home/)
  })
})