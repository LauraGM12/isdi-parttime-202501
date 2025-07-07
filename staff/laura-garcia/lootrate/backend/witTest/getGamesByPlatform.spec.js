import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'
import { getGamesByPlatform } from '../logic/games/getGamesByPlatform.js'

describe('getGamesByPlatform', () => {
  let rawgGetGamesByPlatformStub
  let rawgService

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    rawgGetGamesByPlatformStub = sinon.stub(rawgService, 'getGamesByPlatform')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener juegos por plataforma correctamente', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Game 1', rating: 4.5 },
          { id: 2, name: 'Game 2', rating: 4.2 }
        ],
        count: 100,
        next: 'next_url',
        previous: null
      }

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('4', 1)

      expect(rawgGetGamesByPlatformStub.calledOnceWith('4', 1)).to.be.true
      expect(result).to.deep.equal({
        platform: '4',
        page: 1,
        results: [
          { id: 1, name: 'Game 1', rating: 4.5 },
          { id: 2, name: 'Game 2', rating: 4.2 }
        ],
        count: 100,
        next: 'next_url',
        previous: null
      })
    })

    it('debería usar página 1 por defecto', async () => {
      const mockResponse = {
        results: [],
        count: 0,
        next: null,
        previous: null
      }

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('4')

      expect(rawgGetGamesByPlatformStub.calledOnceWith('4', 1)).to.be.true
      expect(result.page).to.equal(1)
    })

    it('debería manejar respuesta sin resultados', async () => {
      const mockResponse = {}

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('4', 1)

      expect(result).to.deep.equal({
        platform: '4',
        page: 1,
        results: [],
        count: 0,
        next: undefined,
        previous: undefined
      })
    })

    it('debería manejar diferentes páginas', async () => {
      const mockResponse = {
        results: [{ id: 3, name: 'Game 3' }],
        count: 50,
        next: 'https://api.rawg.io/api/games?page=4',
        previous: 'https://api.rawg.io/api/games?page=2'
      }

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('4', 3)

      expect(rawgGetGamesByPlatformStub.calledOnceWith('4', 3)).to.be.true
      expect(result.page).to.equal(3)
      expect(result.next).to.equal(mockResponse.next)
      expect(result.previous).to.equal(mockResponse.previous)
    })
  })

  describe('validaciones', () => {
    it('debería lanzar ValidationError si platformId está vacío', async () => {
      try {
        await getGamesByPlatform('')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El ID de la plataforma es requerido')
      }
    })

    it('debería lanzar ValidationError si platformId es null', async () => {
      try {
        await getGamesByPlatform(null)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El ID de la plataforma es requerido')
      }
    })

    it('debería lanzar ValidationError si platformId es undefined', async () => {
      try {
        await getGamesByPlatform(undefined)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El ID de la plataforma es requerido')
      }
    })

    it('debería lanzar ValidationError si platformId solo contiene espacios', async () => {
      try {
        await getGamesByPlatform('   ')
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('El ID de la plataforma es requerido')
      }
    })

    it('debería lanzar ValidationError si page es menor a 1', async () => {
      try {
        await getGamesByPlatform('4', 0)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La página debe ser mayor a 0')
      }
    })

    it('debería lanzar ValidationError si page es negativa', async () => {
      try {
        await getGamesByPlatform('4', -1)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('La página debe ser mayor a 0')
      }
    })
  })

  describe('manejo de errores', () => {
    it('debería re-lanzar ValidationError del servicio', async () => {
      const validationError = new errors.ValidationError('Error de validación del servicio')
      rawgGetGamesByPlatformStub.rejects(validationError)

      try {
        await getGamesByPlatform('4', 1)
        expect.fail('Debería haber lanzado ValidationError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect(error.message).to.equal('Error de validación del servicio')
      }
    })

    it('debería lanzar ServerError para errores del servicio RAWG', async () => {
      const serviceError = new Error('API Error')
      rawgGetGamesByPlatformStub.rejects(serviceError)

      try {
        await getGamesByPlatform('4', 1)
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Error al obtener juegos por plataforma: API Error')
      }
    })

    it('debería lanzar ServerError para errores de red', async () => {
      const networkError = new Error('Network timeout')
      rawgGetGamesByPlatformStub.rejects(networkError)

      try {
        await getGamesByPlatform('4', 1)
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.equal('Error al obtener juegos por plataforma: Network timeout')
      }
    })

    it('debería manejar errores sin mensaje', async () => {
      const errorWithoutMessage = new Error()
      rawgGetGamesByPlatformStub.rejects(errorWithoutMessage)

      try {
        await getGamesByPlatform('4', 1)
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener juegos por plataforma:')
      }
    })
  })

  describe('casos especiales', () => {
    it('debería aceptar platformId como string numérico', async () => {
      const mockResponse = {
        results: [{ id: 1, name: 'Game 1' }],
        count: 1
      }

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('123', 1)

      expect(rawgGetGamesByPlatformStub.calledOnceWith('123', 1)).to.be.true
      expect(result.platform).to.equal('123')
    })

    it('debería manejar páginas altas', async () => {
      const mockResponse = {
        results: [],
        count: 0,
        next: null,
        previous: 'https://api.rawg.io/api/games?page=999'
      }

      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('4', 1000)

      expect(rawgGetGamesByPlatformStub.calledOnceWith('4', 1000)).to.be.true
      expect(result.page).to.equal(1000)
    })

    it('debería preservar el platformId original en la respuesta', async () => {
      const mockResponse = { results: [], count: 0 }
      rawgGetGamesByPlatformStub.resolves(mockResponse)

      const result = await getGamesByPlatform('pc', 1)

      expect(result.platform).to.equal('pc')
    })
  })
})