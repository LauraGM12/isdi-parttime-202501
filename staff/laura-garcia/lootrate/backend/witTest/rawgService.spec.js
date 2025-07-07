import { expect } from 'chai'
import sinon from 'sinon'
import * as rawgService from '../logic/games/rawgService.js'

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
  let fetchStub

  beforeEach(() => {
    process.env.RAWG_API_KEY = 'test-api-key'
    process.env.RAWG_BASE_URL = 'https://api.rawg.io/api/'
    
    fetchStub = sinon.stub(global, 'fetch')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getGamesByGenre', () => {
    it('debería obtener juegos por género correctamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Action Game' }],
        count: 1
      }

      fetchStub.resolves(mockSuccessResponse(mockData))

      const result = await rawgService.getGamesByGenre('action')

      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('/games')
      expect(callUrl).to.include('genres=action')
      expect(callUrl).to.include('ordering=-rating')
      expect(result).to.deep.equal(mockData)
    })

    it('debería lanzar ServerError cuando la petición a la API falla', async () => {
      fetchStub.resolves(mockErrorResponse(404, 'Not Found'))

      try {
        await rawgService.getGamesByGenre('action')
        expect.fail('Debería haber lanzado un error')
      } catch (error) {
        expect(error.message).to.include('Error al obtener datos de la API RAWG: Error de API RAWG: 404 Not Found')
      }
    })
  })

  describe('getGameStores', () => {
    it('debería obtener las tiendas de juegos exitosamente', async () => {
      const mockData = {
        results: [{ store_id: 1, url: 'https://store.com' }]
      }

      fetchStub.resolves(mockSuccessResponse(mockData))

      const result = await rawgService.getGameStores(123)

      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games/123/stores')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getGameDetails', () => {
    it('debería obtener los detalles del juego exitosamente', async () => {
      const mockData = {
        id: 123,
        name: 'Test Game',
        description: 'Test description'
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGameDetails(123)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games/123')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getGenres', () => {
    it('debería obtener los géneros exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }]
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGenres()
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/genres')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getPlatforms', () => {
    it('debería obtener las plataformas exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'PC' }, { id: 2, name: 'PlayStation' }]
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getPlatforms()
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/platforms')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('searchGames', () => {
    it('debería buscar juegos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Test Game' }],
        count: 1
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.searchGames('test', 1, 20)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games')
      expect(callUrl).to.include('search=test')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getUpcomingGames', () => {
    it('debería obtener los próximos juegos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Upcoming Game' }],
        count: 1
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getUpcomingGames(1, 20)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games')
      expect(callUrl).to.include('ordering=-added')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getGameScreenshots', () => {
    it('debería obtener las capturas de pantalla del juego exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, image: 'screenshot.jpg' }]
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getGameScreenshots(123)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games/123/screenshots')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getTrendingGames', () => {
    it('debería obtener los juegos en tendencia exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Trending Game' }],
        count: 1
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getTrendingGames(1, 20)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games')
      expect(callUrl).to.match(/ordering=.*added.*rating/)
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getTopRatedGames', () => {
    it('debería obtener los juegos mejor valorados exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'Top Rated Game' }],
        count: 1
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getTopRatedGames(1, 20)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games')
      expect(callUrl).to.match(/ordering=.*metacritic.*rating/)
      expect(callUrl).to.match(/metacritic=.*85.*100/)
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getNewReleases', () => {
    it('debería obtener los nuevos lanzamientos exitosamente', async () => {
      const mockData = {
        results: [{ id: 1, name: 'New Release' }],
        count: 1
      }
  
      fetchStub.resolves(mockSuccessResponse(mockData))
  
      const result = await rawgService.getNewReleases(1, 20)
  
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('https://api.rawg.io/api/games')
      expect(callUrl).to.include('ordering=-released')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('getFeaturedGames', () => {
    it('debería obtener los juegos destacados exitosamente', async () => {
      const mockData = { results: [{ id: 1, name: 'Test Game' }] }
      fetchStub.resolves(mockSuccessResponse(mockData))
    
      const result = await rawgService.getFeaturedGames()
    
      expect(fetchStub.calledOnce).to.be.true
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.include('games?key=test-api-key')
      expect(result).to.deep.equal(mockData)
    })
  })

  describe('filtrado de parámetros', () => {
    it('debería filtrar parámetros undefined y null', async () => {
      const mockData = { results: [] }
      fetchStub.resolves(mockSuccessResponse(mockData))
    
      await rawgService.searchGames('test', 1)
    
      const callUrl = fetchStub.getCall(0).args[0]
      expect(callUrl).to.not.include('undefined')
      expect(callUrl).to.not.include('null')
    })
  })
})