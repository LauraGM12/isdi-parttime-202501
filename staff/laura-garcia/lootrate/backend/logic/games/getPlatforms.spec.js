import { jest, describe, beforeEach, it, expect } from '@jest/globals'

const getPlatformsMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  getPlatforms: getPlatformsMock
}))

jest.mock('common', () => ({
  errors: {
    ServerError: class ServerError extends Error {
      constructor(message) {
        super(message)
        this.name = 'ServerError'
      }
    }
  }
}))

import { getPlatforms } from './getPlatforms.js'
import { errors } from 'common'

describe('getPlatforms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería obtener plataformas correctamente', async () => {
    const mockResponse = {
      results: [{ id: 1, name: 'PlayStation' }, { id: 2, name: 'Xbox' }],
      count: 2,
      next: 'next-url',
      previous: null
    }

    getPlatformsMock.mockResolvedValue(mockResponse)

    const result = await getPlatforms()

    expect(getPlatformsMock).toHaveBeenCalled()
    expect(result).toEqual({
      results: mockResponse.results,
      count: 2,
      next: 'next-url',
      previous: null
    })
  })

  it('debería manejar respuestas vacías correctamente', async () => {
    getPlatformsMock.mockResolvedValue({})

    const result = await getPlatforms()

    expect(result).toEqual({
      results: [],
      count: 0,
      next: undefined,
      previous: undefined
    })
  })

  it('debería manejar results null/undefined', async () => {
    getPlatformsMock.mockResolvedValue({
      results: null,
      count: null,
      next: 'next-url',
      previous: 'prev-url'
    })

    const result = await getPlatforms()

    expect(result).toEqual({
      results: [],
      count: 0,
      next: 'next-url',
      previous: 'prev-url'
    })
  })

  it('debería manejar count undefined', async () => {
    getPlatformsMock.mockResolvedValue({
      results: [{ id: 1, name: 'PlayStation' }],
      count: undefined,
      next: null,
      previous: null
    })

    const result = await getPlatforms()

    expect(result).toEqual({
      results: [{ id: 1, name: 'PlayStation' }],
      count: 0,
      next: null,
      previous: null
    })
  })

  it('debería lanzar ServerError si ocurre un error', async () => {
    getPlatformsMock.mockRejectedValue(new Error('Error inesperado'))

    await expect(getPlatforms()).rejects.toThrow(errors.ServerError)
    await expect(getPlatforms()).rejects.toThrow('Error al obtener plataformas')
  })
})
