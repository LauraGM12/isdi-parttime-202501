import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'

describe('getGamesByGenre', () => {
  let rawgGetGamesByGenreStub
  let rawgService
  let getGamesByGenreModule

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    getGamesByGenreModule = await import('../logic/games/getGamesByGenre.js')
    rawgGetGamesByGenreStub = sinon.stub(rawgService, 'getGamesByGenre')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener juegos por género correctamente', async () => {
      const mockRawgData = {
        results: [{ id: 1, name: 'Action Game' }],
        count: 1,
        next: null,
        previous: null
      }

      rawgGetGamesByGenreStub.resolves(mockRawgData)

      const result = await getGamesByGenreModule.getGamesByGenre('action', 1)

      expect(rawgGetGamesByGenreStub.calledOnceWith('action', 1)).to.be.true
      expect(result).to.deep.equal({
        genre: 'action',
        page: 1,
        results: [{ id: 1, name: 'Action Game' }],
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

      rawgGetGamesByGenreStub.resolves(mockRawgData)

      const result = await getGamesByGenreModule.getGamesByGenre('action')

      expect(rawgGetGamesByGenreStub.calledOnceWith('action', 1)).to.be.true
      expect(result.page).to.equal(1)
    })

    it('debería manejar respuesta sin resultados', async () => {
      const mockRawgData = {}

      rawgGetGamesByGenreStub.resolves(mockRawgData)

      const result = await getGamesByGenreModule.getGamesByGenre('rpg')

      expect(result.results).to.deep.equal([])
      expect(result.count).to.equal(0)
    })
  })

  describe('validaciones', () => {
    it('debería lanzar ValidationError si genreSlug está vacío', async () => {
      try {
        await getGamesByGenreModule.getGamesByGenre('')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El slug del género es requerido')
      }
    })

    it('debería lanzar ValidationError si genreSlug es null', async () => {
      try {
        await getGamesByGenreModule.getGamesByGenre(null)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El slug del género es requerido')
      }
    })

    it('debería lanzar ValidationError si genreSlug solo contiene espacios', async () => {
      try {
        await getGamesByGenreModule.getGamesByGenre('   ')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El slug del género es requerido')
      }
    })

    it('debería lanzar ValidationError si page es menor a 1', async () => {
      try {
        await getGamesByGenreModule.getGamesByGenre('action', 0)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La página debe ser mayor a 0')
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería re-lanzar ValidationError del servicio', async () => {
      const validationError = new errors.ValidationError('Error de validación')
      rawgGetGamesByGenreStub.rejects(validationError)

      try {
        await getGamesByGenreModule.getGamesByGenre('action')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.equal(validationError)
      }
    })

    it('debería convertir otros errores a ServerError', async () => {
      const originalError = new Error('Error de red')
      rawgGetGamesByGenreStub.rejects(originalError)

      try {
        await getGamesByGenreModule.getGamesByGenre('action')
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener juegos por género: Error de red')
      }
    })
  })
})