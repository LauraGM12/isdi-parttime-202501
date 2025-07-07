import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'

describe('getHomeData', () => {
  let stubs
  let rawgService
  let getHomeDataModule 

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    getHomeDataModule = await import('../logic/games/getHomeData.js')
    
    stubs = {
      getFeaturedGames: sinon.stub(rawgService, 'getFeaturedGames'),
      getGenres: sinon.stub(rawgService, 'getGenres'),
      getUpcomingGames: sinon.stub(rawgService, 'getUpcomingGames'),
      getTrendingGames: sinon.stub(rawgService, 'getTrendingGames'),
      getNewReleases: sinon.stub(rawgService, 'getNewReleases'),
      getTopRatedGames: sinon.stub(rawgService, 'getTopRatedGames')
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener todos los datos del home correctamente', async () => {
      const mockData = {
        featuredGames: { results: [{ id: 1, name: 'Featured Game' }] },
        genres: { results: [{ id: 1, name: 'Action' }] },
        upcomingGames: { results: [{ id: 2, name: 'Upcoming Game' }] },
        trendingGames: { results: [{ id: 3, name: 'Trending Game' }] },
        newReleases: { results: [{ id: 4, name: 'New Release' }] },
        topRated: { results: [{ id: 5, name: 'Top Rated Game' }] }
      }

      stubs.getFeaturedGames.resolves(mockData.featuredGames)
      stubs.getGenres.resolves(mockData.genres)
      stubs.getUpcomingGames.resolves(mockData.upcomingGames)
      stubs.getTrendingGames.resolves(mockData.trendingGames)
      stubs.getNewReleases.resolves(mockData.newReleases)
      stubs.getTopRatedGames.resolves(mockData.topRated)

      const result = await getHomeDataModule.getHomeData()

      expect(stubs.getFeaturedGames.calledOnceWith(1, 10)).to.be.true
      expect(stubs.getGenres.calledOnce).to.be.true
      expect(stubs.getUpcomingGames.calledOnceWith(1, 6)).to.be.true
      expect(stubs.getTrendingGames.calledOnceWith(1, 6)).to.be.true
      expect(stubs.getNewReleases.calledOnceWith(1, 6)).to.be.true
      expect(stubs.getTopRatedGames.calledOnceWith(1, 6)).to.be.true

      expect(result).to.deep.equal({
        featured: { id: 1, name: 'Featured Game' },
        trending: [{ id: 3, name: 'Trending Game' }],
        newReleases: [{ id: 4, name: 'New Release' }],
        topRated: [{ id: 5, name: 'Top Rated Game' }],
        upcoming: [{ id: 2, name: 'Upcoming Game' }],
        genres: [{ id: 1, name: 'Action' }]
      })
    })

    it('debería manejar respuestas vacías', async () => {
      const emptyData = { results: [] }

      Object.values(stubs).forEach(stub => {
        stub.resolves(emptyData)
      })

      const result = await getHomeDataModule.getHomeData()

      expect(result).to.deep.equal({
        featured: null,
        trending: [],
        newReleases: [],
        topRated: [],
        upcoming: [],
        genres: []
      })
    })

    it('debería manejar respuestas sin results', async () => {
      Object.values(stubs).forEach(stub => {
        stub.resolves({})
      })

      const result = await getHomeDataModule.getHomeData()

      expect(result).to.deep.equal({
        featured: null,
        trending: [],
        newReleases: [],
        topRated: [],
        upcoming: [],
        genres: []
      })
    })
  })

  describe('manejo de errores', () => {
    it('debería convertir errores a ServerError', async () => {
      const originalError = new Error('Error de API')
      stubs.getFeaturedGames.rejects(originalError)

      try {
        await getHomeDataModule.getHomeData()
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener datos del home: Error de API')
      }
    })

    it('debería manejar error en cualquiera de las llamadas', async () => {
      stubs.getFeaturedGames.resolves({ results: [] })
      stubs.getGenres.rejects(new Error('Error en géneros'))

      try {
        await getHomeDataModule.getHomeData()
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener datos del home: Error en géneros')
      }
    })
  })
})