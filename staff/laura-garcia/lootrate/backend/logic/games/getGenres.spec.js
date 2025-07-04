import { getGenres } from './getGenres.js'
import { errors } from 'common'
import { jest, describe, beforeEach, it, expect } from '@jest/globals'

process.env.RAWG_API_KEY = 'test-api-key'

const getGenresMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  getGenres: getGenresMock
}))

describe('getGenres', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería obtener géneros correctamente', async () => {
    const mockResponse = {
      results: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }],
      count: 2,
      next: 'next-url',
      previous: null
    }

    getGenresMock.mockResolvedValue(mockResponse)

    const result = await getGenres()

    expect(getGenresMock).toHaveBeenCalled()
    expect(result).toEqual({
      results: mockResponse.results,
      count: 2,
      next: 'next-url',
      previous: null
    })
  }, 5000)

  it('debería manejar respuestas vacías correctamente', async () => {
    getGenresMock.mockResolvedValue({})

    const result = await getGenres()

    expect(result).toEqual({
      results: [],
      count: 0,
      next: undefined,
      previous: undefined
    })
  }, 5000)

  it('debería lanzar ServerError si ocurre un error', async () => {
    getGenresMock.mockRejectedValue(new Error('Error de API'))

    await expect(getGenres()).rejects.toThrow(errors.ServerError)
  }, 5000) 
})
