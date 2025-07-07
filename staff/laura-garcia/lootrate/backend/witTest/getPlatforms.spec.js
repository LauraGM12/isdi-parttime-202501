import { expect } from 'chai'
import sinon from 'sinon'
import { errors } from 'common'

describe('getPlatforms', () => {
  let rawgServiceStub
  let rawgService
  let getPlatformsModule 

  beforeEach(async () => {
    rawgService = await import('../logic/games/rawgService.js')
    getPlatformsModule = await import('../logic/games/getPlatforms.js')
    rawgServiceStub = sinon.stub(rawgService, 'getPlatforms')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('casos exitosos', () => {
    it('debería obtener plataformas correctamente', async () => {
      const mockRawgData = {
        results: [
          { id: 4, name: 'PC' },
          { id: 18, name: 'PlayStation 4' }
        ],
        count: 2,
        next: null,
        previous: null
      }

      rawgServiceStub.resolves(mockRawgData)

      const result = await getPlatformsModule.getPlatforms()

      expect(rawgServiceStub.calledOnce).to.be.true
      expect(result).to.deep.equal({
        results: [
          { id: 4, name: 'PC' },
          { id: 18, name: 'PlayStation 4' }
        ],
        count: 2,
        next: null,
        previous: null
      })
    })

    it('debería manejar respuesta sin resultados', async () => {
      const mockRawgData = {}

      rawgServiceStub.resolves(mockRawgData)

      const result = await getPlatformsModule.getPlatforms()

      expect(result.results).to.deep.equal([])
      expect(result.count).to.equal(0)
    })
  })

  describe('manejo de errores', () => {
    it('debería convertir errores a ServerError', async () => {
      const originalError = new Error('Error de red')
      rawgServiceStub.rejects(originalError)

      try {
        await getPlatformsModule.getPlatforms()
        expect.fail('Debería haber lanzado ServerError')
      } catch (error) {
        expect(error).to.be.instanceOf(errors.ServerError)
        expect(error.message).to.include('Error al obtener plataformas: Error de red')
      }
    })
  })
})