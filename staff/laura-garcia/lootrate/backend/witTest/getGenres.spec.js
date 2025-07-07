import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'

describe('getGenres', () => {
  let rawgServiceStub
  let rawgService
  let getGenresModule

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    
    rawgServiceStub = sinon.stub(rawgService, 'getGenres')
    
    getGenresModule = await import('../logic/games/getGenres.js')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener géneros correctamente', async () => {
      const mockRawgData = {
        results: [
          { id: 1, name: 'Action', slug: 'action' },
          { id: 2, name: 'Adventure', slug: 'adventure' }
        ],
        count: 2,
        next: null,
        previous: null
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await getGenresModule.getGenres()

      expect(rawgServiceStub.calledOnce).to.be.true
      expect(result).to.deep.equal({
        results: [
          { id: 1, name: 'Action', slug: 'action' },
          { id: 2, name: 'Adventure', slug: 'adventure' }
        ],
        count: 2,
        next: null,
        previous: null
      })
    })

    it('debería manejar respuesta sin resultados', async () => {
      const mockRawgData = {}

      rawgServiceStub.resolves(mockRawgData)

      const result = await getGenresModule.getGenres()

      expect(result.results).to.deep.equal([])
      expect(result.count).to.equal(0)
    })

    it('debería manejar múltiples géneros', async () => {
      const mockRawgData = {
        results: [
          { id: 1, name: 'Action', slug: 'action' },
          { id: 2, name: 'Adventure', slug: 'adventure' },
          { id: 3, name: 'RPG', slug: 'role-playing-games-rpg' }
        ],
        count: 3,
        next: 'https://api.rawg.io/api/genres?page=2',
        previous: null
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await getGenresModule.getGenres()

      expect(result.results).to.have.length(3)
      expect(result.count).to.equal(3)
      expect(result.next).to.equal('https://api.rawg.io/api/genres?page=2')
    })
  })

  describe('manejo de errores', () => {
    it('debería convertir errores a ServerError', async () => {
      const originalError = new Error('Error de conexión')
      rawgServiceStub.rejects(originalError)

      try {
        await getGenresModule.getGenres()
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener géneros: Error de conexión')
      }
    })

    it('debería manejar errores de red', async () => {
      const networkError = new Error('Network timeout')
      rawgServiceStub.rejects(networkError)

      try {
        await getGenresModule.getGenres()
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener géneros: Network timeout')
      }
    })
  })
})