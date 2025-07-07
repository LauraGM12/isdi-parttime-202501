import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'

describe('searchGames', () => {
  let rawgServiceStub
  let rawgService
  let searchGamesModule

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    searchGamesModule = await import('../logic/games/searchGames.js')
    rawgServiceStub = sinon.stub(rawgService, 'searchGames')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería buscar juegos correctamente', async () => {
      const mockRawgData = {
        results: [{ id: 1, name: 'The Witcher 3' }],
        count: 1,
        next: null,
        previous: null
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await searchGamesModule.searchGames('witcher', 1)

      expect(rawgServiceStub.calledOnceWith('witcher', 1)).to.be.true
      expect(result).to.deep.equal({
        query: 'witcher',
        page: 1,
        results: [{ id: 1, name: 'The Witcher 3' }],
        count: 1,
        next: null,
        previous: null
      })
    })

    it('debería usar página por defecto cuando no se especifica', async () => {
      const mockRawgData = {
        results: [],
        count: 0
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await searchGamesModule.searchGames('cyberpunk')

      expect(rawgServiceStub.calledOnceWith('cyberpunk', 1)).to.be.true
      expect(result.page).to.equal(1)
    })

    it('debería limpiar espacios en la query', async () => {
      const mockRawgData = {
        results: [],
        count: 0
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await searchGamesModule.searchGames('  gta  ')

      expect(result.query).to.equal('gta')
    })
  })

  describe('validaciones', () => {
    it('debería lanzar ValidationError si query está vacía', async () => {
      try {
        await searchGamesModule.searchGames('')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La consulta de búsqueda es requerida')
      }
    })

    it('debería lanzar ValidationError si query es null', async () => {
      try {
        await searchGamesModule.searchGames(null)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La consulta de búsqueda es requerida')
      }
    })

    it('debería lanzar ValidationError si query solo contiene espacios', async () => {
      try {
        await searchGamesModule.searchGames('   ')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La consulta de búsqueda es requerida')
      }
    })

    it('debería lanzar ValidationError si page es menor a 1', async () => {
      try {
        await searchGamesModule.searchGames('test', 0)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La página debe ser mayor a 0')
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería propagar ValidationError del rawgService', async () => {
      const validationError = new errors.ValidationError('Error de validación')
      rawgServiceStub.rejects(validationError)

      try {
        await searchGamesModule.searchGames('test')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.equal(validationError)
      }
    })

    it('debería convertir otros errores a ServerError', async () => {
      const originalError = new Error('Error de API')
      rawgServiceStub.rejects(originalError)

      try {
        await searchGamesModule.searchGames('test')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al buscar juegos: Error de API')
      }
    })
  })
})