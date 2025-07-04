import { jest } from '@jest/globals'
import * as rawgService from './rawgService.js'

global.fetch = jest.fn()

const mockSuccessResponse = (data) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data)
  })
}

const mockErrorResponse = (status = 404, statusText = 'Not Found') => {
  return Promise.resolve({
    ok: false,
    status: status,
    statusText: statusText,
    json: () => Promise.resolve({})
  })
}

describe('rawgService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    process.env.RAWG_API_KEY = 'test-api-key'
    process.env.RAWG_BASE_URL = 'https://api.rawg.io/api/'
    
    global.fetch = jest.fn()
  })

  describe('getGamesByGenre', () => {
    it('debería obtener juegos por género correctamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Action Game' }],
        count: 1
      }

      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))

      const result = await rawgService.getGamesByGenre('action')

      const callUrl = global.fetch.mock.calls[0][0]
      expect(callUrl).toContain('/games')
      expect(callUrl).toContain('genres=action')
      expect(callUrl).toContain('ordering=-rating')
      expect(result).toEqual(mockData)
    })

    it('debería lanzar ServerError cuando la petición a la API falla', async () => {
      fetch.mockImplementation(() => mockErrorResponse(404, 'Not Found'))

      await expect(rawgService.getGamesByGenre('action'))
        .rejects.toThrow('Error al obtener datos de la API RAWG: Error de API RAWG: 404 Not Found')
    })
  })

  describe('getGameStores', () => {
    it('debería obtener las tiendas de juegos exitosamente', async () => {
      const mockData = {
        results: [{ store_id: 1, url: 'https://store.com' }]
      }

      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))

      const result = await rawgService.getGameStores(123)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123/stores')
      )

      expect(result).toEqual(mockData)
    })
  })

  describe('getGameDetails', () => {
    it('debería obtener los detalles del juego exitosamente', async () => {
      const mockData = {
        id: 123,
        name: 'Test Game',
        description: 'Test description'
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGameDetails(123)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getGenres', () => {
    it('debería obtener los géneros exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }]
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGenres()
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/genres')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getPlatforms', () => {
    it('debería obtener las plataformas exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'PC' }, { id: 2, name: 'PlayStation' }]
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getPlatforms()
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/platforms')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('searchGames', () => {
    it('debería buscar juegos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Test Game' }],
        count: 1
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.searchGames('test', 1, 20)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getUpcomingGames', () => {
    it('debería obtener los próximos juegos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Upcoming Game' }],
        count: 1
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getUpcomingGames(1, 20)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-added')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getGameScreenshots', () => {
    it('debería obtener las capturas de pantalla del juego exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, image: 'screenshot.jpg' }]
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGameScreenshots(123)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/123/screenshots')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getTrendingGames', () => {
    it('debería obtener los juegos en tendencia exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Trending Game' }],
        count: 1
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getTrendingGames(1, 20)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/ordering=.*added.*rating/)
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getTopRatedGames', () => {
    it('debería obtener los juegos mejor valorados exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Top Rated Game' }],
        count: 1
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getTopRatedGames(1, 20)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/ordering=.*metacritic.*rating/)
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/metacritic=.*85.*100/)
      )
  
      expect(result).toEqual(mockData)
    })
  })

  describe('getNewReleases', () => {
    it('debería obtener los nuevos lanzamientos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'New Release' }],
        count: 1
      }
  
      global.fetch.mockResolvedValueOnce(mockSuccessResponse(mockData))
  
      const result = await rawgService.getNewReleases(1, 20)
  
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-released')
      )
  
      expect(result).toEqual(mockData)
    })
  })

  it('debería manejar endpoints sin barra inicial', async () => {
    const mockData = { results: [{ id: 1, name: 'Test Game' }] }
    global.fetch.mockResolvedValue(mockSuccessResponse(mockData))
  
    const result = await rawgService.getFeaturedGames()
  
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('games?key=test-api-key')
    )
    expect(result).toEqual(mockData)
  })

  it('debería filtrar parámetros undefined y null', async () => {
    const mockData = { results: [] }
    global.fetch.mockResolvedValue(mockSuccessResponse(mockData))
  
    await rawgService.searchGames('test', 1)
  
    const callUrl = global.fetch.mock.calls[0][0]
    expect(callUrl).not.toContain('undefined')
    expect(callUrl).not.toContain('null')
  })
})