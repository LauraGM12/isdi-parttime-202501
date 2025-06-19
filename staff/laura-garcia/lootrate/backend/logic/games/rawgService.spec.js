import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import * as rawgService from './rawgService.js'

// Mock de fetch global
global.fetch = jest.fn()

describe('rawgService', () => {
  // Mock de respuesta exitosa
  const mockSuccessResponse = (data) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data)
    })
  }

  // Mock de respuesta fallida
  const mockErrorResponse = (status, statusText) => {
    return Promise.resolve({
      ok: false,
      status,
      statusText
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Restaurar variables de entorno con formato correcto
    process.env.RAWG_API_KEY = 'test-api-key'
    process.env.RAWG_BASE_URL = 'https://api.rawg.io/api/' // Añadida la barra al final
})

  describe('getGamesByGenre', () => {
    it('debería obtener juegos por género exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Game 1' }],
        count: 1
      }

      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))

      // Ejecutar la función
      const result = await rawgService.getGamesByGenre('action', 1, 20)

      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('genres=action')
      )

      // Verificar el resultado
      expect(result).toEqual(mockData)
    })

    it('debería lanzar ServerError cuando la petición a la API falla', async () => {
      // Configurar mock de fetch para simular error
      global.fetch.mockResolvedValueOnce(mockErrorResponse(404, 'Not Found'))

      // Verificar que se lanza el error correcto
      await expect(rawgService.getGamesByGenre('action'))
        .rejects.toThrow('Error fetching from RAWG API: RAWG API error: 404 Not Found')
    })
  })

  describe('getGameStores', () => {
    it('debería obtener las tiendas de juegos exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ store_id: 1, url: 'https://store.com' }]
      }

      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))

      // Ejecutar la función
      const result = await rawgService.getGameStores(123)

      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123/stores')
      )

      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getGameDetails', () => {
    it('debería obtener los detalles del juego exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        id: 123,
        name: 'Test Game',
        description: 'Test description'
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getGameDetails(123)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getGenres', () => {
    it('debería obtener los géneros exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }]
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getGenres()
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/genres')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getPlatforms', () => {
    it('debería obtener las plataformas exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'PC' }, { id: 2, name: 'PlayStation' }]
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getPlatforms()
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/platforms')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('searchGames', () => {
    it('debería buscar juegos exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Test Game' }],
        count: 1
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.searchGames('test', 1, 20)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getUpcomingGames', () => {
    it('debería obtener los próximos juegos exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Upcoming Game' }],
        count: 1
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getUpcomingGames(1, 20)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-added')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getGameScreenshots', () => {
    it('debería obtener las capturas de pantalla del juego exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, image: 'screenshot.jpg' }]
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getGameScreenshots(123)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123/screenshots')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getTrendingGames', () => {
    it('debería obtener los juegos en tendencia exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Trending Game' }],
        count: 1
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getTrendingGames(1, 20)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/ordering=.*added.*rating/)
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getTopRatedGames', () => {
    it('debería obtener los juegos mejor valorados exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'Top Rated Game' }],
        count: 1
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getTopRatedGames(1, 20)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/ordering=.*metacritic.*rating/)
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/metacritic=.*85.*100/)
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })

  describe('getNewReleases', () => {
    it('debería obtener los nuevos lanzamientos exitosamente', async () => {
      // Mock de datos de respuesta
      const mockData = {
        results: [{ id: 1, name: 'New Release' }],
        count: 1
      }
  
      // Configurar mock de fetch
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      // Ejecutar la función
      const result = await rawgService.getNewReleases(1, 20)
  
      // Verificar que se llamó a fetch con la URL correcta
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-released')
      )
  
      // Verificar el resultado
      expect(result).toEqual(mockData)
    })
  })
})