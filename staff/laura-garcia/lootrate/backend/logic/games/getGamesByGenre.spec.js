import { getGamesByGenre } from './getGamesByGenre.js'
import { errors } from 'common'
import { jest, describe, beforeEach, it, expect } from '@jest/globals'

const getGamesByGenreMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  getGamesByGenre: getGamesByGenreMock
}))

describe('getGamesByGenre', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería obtener juegos por género correctamente', async () => {
    const mockResponse = {
      results: [{ id: 1, name: 'Game 1' }, { id: 2, name: 'Game 2' }],
      count: 2,
      next: 'next-page-url',
      previous: null
    }

    getGamesByGenreMock.mockResolvedValue(mockResponse)

    const result = await getGamesByGenre('action', 1)

    expect(getGamesByGenreMock).toHaveBeenCalledWith('action', 1)

    expect(result).toEqual({
      genre: 'action',
      page: 1,
      results: mockResponse.results,
      count: mockResponse.count,
      next: mockResponse.next,
      previous: mockResponse.previous
    })
  }, 5000)

  it('debería fallar con género vacío', async () => {
    await expect(getGamesByGenre('')).rejects.toThrow('El slug del género es requerido')

    expect(getGamesByGenreMock).not.toHaveBeenCalled()
  })

  it('debería fallar con página inválida', async () => {
    await expect(getGamesByGenre('action', 0)).rejects.toThrow('La página debe ser mayor a 0')

    expect(getGamesByGenreMock).not.toHaveBeenCalled()
  })

  it('debería manejar errores del servicio correctamente', async () => {
    getGamesByGenreMock.mockRejectedValue(new Error('Error de API'))

    await expect(getGamesByGenre('action', 1)).rejects.toThrow(errors.ServerError)
  }, 5000)

  it('debería manejar respuestas vacías correctamente', async () => {
    getGamesByGenreMock.mockResolvedValue({})

    const result = await getGamesByGenre('action', 1)

    expect(result).toEqual({
      genre: 'action',
      page: 1,
      results: [],
      count: 0,
      next: undefined,
      previous: undefined
    })
  }, 5000)
})
