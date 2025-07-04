import { jest, describe, beforeEach, it, expect } from '@jest/globals'

const getGamesByPlatformMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  getGamesByPlatform: getGamesByPlatformMock
}))

import { getGamesByPlatform } from './getGamesByPlatform.js'
import { errors } from 'common'

describe('getGamesByPlatform', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería obtener juegos por plataforma correctamente', async () => {
    const mockResponse = {
      results: [{ id: 1, name: 'Game 1' }],
      count: 1,
      next: null,
      previous: null
    }

    getGamesByPlatformMock.mockResolvedValue(mockResponse)

    const result = await getGamesByPlatform('playstation', 2)

    expect(getGamesByPlatformMock).toHaveBeenCalledWith('playstation', 2)
    expect(result).toEqual({
      platform: 'playstation',
      page: 2,
      results: mockResponse.results,
      count: 1,
      next: null,
      previous: null
    })
  }, 5000)

  it('debería manejar respuestas vacías correctamente', async () => {
    getGamesByPlatformMock.mockResolvedValue({})

    const result = await getGamesByPlatform('xbox', 1)

    expect(result).toEqual({
      platform: 'xbox',
      page: 1,
      results: [],
      count: 0,
      next: undefined,
      previous: undefined
    })
  }, 5000)

  it('debería lanzar error si el ID de la plataforma es vacío', async () => {
    await expect(getGamesByPlatform('')).rejects.toThrow('El ID de la plataforma es requerido')
    expect(getGamesByPlatformMock).not.toHaveBeenCalled()
  })

  it('debería lanzar error si la página es menor a 1', async () => {
    await expect(getGamesByPlatform('switch', 0)).rejects.toThrow('La página debe ser mayor a 0')
    expect(getGamesByPlatformMock).not.toHaveBeenCalled()
  })

  it('debería lanzar ServerError si ocurre un error en el servicio', async () => {
    getGamesByPlatformMock.mockRejectedValue(new Error('Error de API'))

    await expect(getGamesByPlatform('pc', 1)).rejects.toThrow(errors.ServerError)
  }, 5000) 
})
