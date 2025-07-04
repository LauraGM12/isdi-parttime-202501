import { jest, describe, beforeEach, it, expect } from '@jest/globals'

const getFeaturedGamesMock = jest.fn()
const getGenresMock = jest.fn()
const getUpcomingGamesMock = jest.fn()
const getTrendingGamesMock = jest.fn()
const getNewReleasesMock = jest.fn()
const getTopRatedGamesMock = jest.fn()

jest.mock('./rawgService.js', () => ({
  getFeaturedGames: getFeaturedGamesMock,
  getGenres: getGenresMock,
  getUpcomingGames: getUpcomingGamesMock,
  getTrendingGames: getTrendingGamesMock,
  getNewReleases: getNewReleasesMock,
  getTopRatedGames: getTopRatedGamesMock
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

import { getHomeData } from './getHomeData.js'
import { errors } from 'common'

describe('getHomeData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
  })

  it('debería retornar datos del home formateados cuando todas las llamadas a la API son exitosas', async () => {
    getFeaturedGamesMock.mockResolvedValue({ results: [{ id: 1, name: 'Featured Game' }] })
    getGenresMock.mockResolvedValue({ results: [{ id: 1, name: 'Action' }] })
    getUpcomingGamesMock.mockResolvedValue({ results: [{ id: 2, name: 'Upcoming Game' }] })
    getTrendingGamesMock.mockResolvedValue({ results: [{ id: 3, name: 'Trending Game' }] })
    getNewReleasesMock.mockResolvedValue({ results: [{ id: 4, name: 'New Release' }] })
    getTopRatedGamesMock.mockResolvedValue({ results: [{ id: 5, name: 'Top Rated Game' }] })

    const result = await getHomeData()

    expect(getFeaturedGamesMock).toHaveBeenCalledWith(1, 10)
    expect(getGenresMock).toHaveBeenCalled()
    expect(getUpcomingGamesMock).toHaveBeenCalledWith(1, 6)
    expect(getTrendingGamesMock).toHaveBeenCalledWith(1, 6)
    expect(getNewReleasesMock).toHaveBeenCalledWith(1, 6)
    expect(getTopRatedGamesMock).toHaveBeenCalledWith(1, 6)

    expect(result).toEqual({
      featured: { id: 1, name: 'Featured Game' },
      trending: [{ id: 3, name: 'Trending Game' }],
      newReleases: [{ id: 4, name: 'New Release' }],
      topRated: [{ id: 5, name: 'Top Rated Game' }],
      upcoming: [{ id: 2, name: 'Upcoming Game' }],
      genres: [{ id: 1, name: 'Action' }]
    })
  })

  it('debería manejar resultados vacíos de las llamadas a la API', async () => {
    getFeaturedGamesMock.mockResolvedValue({ results: [] })
    getGenresMock.mockResolvedValue({ results: [] })
    getUpcomingGamesMock.mockResolvedValue({ results: [] })
    getTrendingGamesMock.mockResolvedValue({ results: [] })
    getNewReleasesMock.mockResolvedValue({ results: [] })
    getTopRatedGamesMock.mockResolvedValue({ results: [] })

    const result = await getHomeData()

    expect(result).toEqual({
      featured: null,
      trending: [],
      newReleases: [],
      topRated: [],
      upcoming: [],
      genres: []
    })
  })

  it('debería manejar respuestas undefined/null correctamente', async () => {
    getFeaturedGamesMock.mockResolvedValue({})
    getGenresMock.mockResolvedValue({})
    getUpcomingGamesMock.mockResolvedValue({})
    getTrendingGamesMock.mockResolvedValue({})
    getNewReleasesMock.mockResolvedValue({})
    getTopRatedGamesMock.mockResolvedValue({})

    const result = await getHomeData()

    expect(result).toEqual({
      featured: null,
      trending: [],
      newReleases: [],
      topRated: [],
      upcoming: [],
      genres: []
    })
  })

  it('debería lanzar ServerError cuando getFeaturedGames falla', async () => {
    getFeaturedGamesMock.mockRejectedValue(new Error('Error de API'))

    await expect(getHomeData()).rejects.toThrow(errors.ServerError)
    await expect(getHomeData()).rejects.toThrow(/Error al obtener datos del home/)
  })

  it('debería lanzar ServerError cuando getGenres falla', async () => {
    getFeaturedGamesMock.mockResolvedValue({ results: [] })
    getGenresMock.mockRejectedValue(new Error('Error de géneros'))

    await expect(getHomeData()).rejects.toThrow(errors.ServerError)
    await expect(getHomeData()).rejects.toThrow(/Error al obtener datos del home/)
  })

  it('debería lanzar ServerError cuando getUpcomingGames falla', async () => {
    getFeaturedGamesMock.mockResolvedValue({ results: [] })
    getGenresMock.mockResolvedValue({ results: [] })
    getUpcomingGamesMock.mockRejectedValue(new Error('Error de próximos'))

    await expect(getHomeData()).rejects.toThrow(errors.ServerError)
    await expect(getHomeData()).rejects.toThrow(/Error al obtener datos del home/)
  })
})