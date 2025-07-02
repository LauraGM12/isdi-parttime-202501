import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { addToGameList, removeFromGameList, getGameList } from './manageGameLists.js'
import { data } from '../../data/index.js'
import { errors } from 'common'

jest.mock('../../data/index.js')

describe('manageGameLists', () => {
  const mockUser = {
    _id: 'user123',
    wishlist: [],
    currentlyPlaying: [],
    completedGames: [],
    save: jest.fn().mockResolvedValue({})
  }

  beforeEach(() => {
    jest.clearAllMocks()
    data.users.findById = jest.fn()
    data.users.findOne = jest.fn()
  })

  describe('addToGameList', () => {
    it('debería agregar un juego a la lista de deseos', async () => {
      const userWithSave = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true)
      };
      
      data.users.findById.mockResolvedValue(userWithSave);
      
      const gameData = {
        gameId: '123',
        gameName: 'Test Game',
        gameImage: 'image.jpg'
      };
      
      await addToGameList('user123', gameData, 'wishlist');
      
      expect(data.users.findById).toHaveBeenCalledWith('user123');
      
      expect(userWithSave.save).toHaveBeenCalled();
    });

    it('debería lanzar ValidationError para tipo de lista inválido', async () => {
      await expect(addToGameList('user123', { gameId: '123', gameName: 'Test' }, 'invalidList'))
        .rejects.toThrow('invalid list type')
    })

    it('debería lanzar ValidationError por datos de juego faltantes', async () => {
      await expect(addToGameList('user123', { gameId: '123' }, 'wishlist'))
        .rejects.toThrow('gameId and gameName are required')
    })

    it('debería lanzar ValidationError por gameId faltante', async () => {
      await expect(addToGameList('user123', { gameName: 'Test' }, 'wishlist'))
        .rejects.toThrow('gameId and gameName are required')
    })
    
    it('debería manejar gameImage nulo correctamente', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true)
      }
      data.users.findById.mockResolvedValue(user)

      await addToGameList('user123', { gameId: '123', gameName: 'Test', gameImage: null }, 'wishlist')

      expect(user.wishlist[0].gameImage).toBeNull()
    })
    
    it('debería manejar rating faltante para completedGames', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true)
      }
      data.users.findById.mockResolvedValue(user)

      await addToGameList('user123', { gameId: '123', gameName: 'Test' }, 'completedGames')

      expect(user.completedGames[0].rating).toBeNull()
    })

    it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
      data.users.findById.mockResolvedValue(null)

      await expect(addToGameList('user123', { gameId: '123', gameName: 'Test' }, 'wishlist'))
        .rejects.toThrow('user not found')
    })

    it('debería lanzar DuplicityError si el juego ya está en la lista', async () => {
      data.users.findById.mockResolvedValue({
        ...mockUser,
        wishlist: [{ gameId: '123', gameName: 'Test Game' }]
      })

      await expect(addToGameList('user123', { gameId: '123', gameName: 'Test' }, 'wishlist'))
        .rejects.toThrow('game already in list')
    })

    it('debería agregar la propiedad hoursPlayed para la lista currentlyPlaying', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true)
      }
      data.users.findById.mockResolvedValue(user)

      await addToGameList('user123', { gameId: '123', gameName: 'Test' }, 'currentlyPlaying')

      expect(user.currentlyPlaying[0]).toHaveProperty('hoursPlayed', 0)
    })

    it('debería agregar la propiedad rating para la lista completedGames', async () => {
      const user = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true)
      }
      data.users.findById.mockResolvedValue(user)

      await addToGameList('user123', { gameId: '123', gameName: 'Test', rating: 5 }, 'completedGames')

      expect(user.completedGames[0]).toHaveProperty('rating', 5)
    })
  })

  describe('removeFromGameList', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      data.users.findById = jest.fn()
    })
    
    it('debería quitar un juego de la lista de deseos', async () => {
      const mockUser = {
        _id: 'user123',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        save: jest.fn().mockResolvedValue(true)
      }
      
      data.users.findById.mockResolvedValue(mockUser)
      
      await removeFromGameList('user123', '123', 'wishlist')
      
      expect(data.users.findById).toHaveBeenCalledWith('user123')
      
      expect(mockUser.save).toHaveBeenCalled()
      
      expect(mockUser.wishlist).toEqual([])
    })
    
    it('debería lanzar ValidationError para tipo de lista inválido', async () => {
      await expect(removeFromGameList('user123', '123', 'invalidList'))
        .rejects.toThrow('invalid list type')
    })
    
    it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
      data.users.findById.mockResolvedValue(null)
      
      await expect(removeFromGameList('user123', '123', 'wishlist'))
        .rejects.toThrow('user not found')
    })
    
    it('debería manejar elementos null en la lista', async () => {
      const mockUser = {
        _id: 'user123',
        wishlist: [null, { gameId: '123', gameName: 'Test Game' }, null],
        save: jest.fn().mockResolvedValue(true)
      }
      
      data.users.findById.mockResolvedValue(mockUser)
      
      await removeFromGameList('user123', '123', 'wishlist')
      
      expect(mockUser.wishlist).toEqual([])
    })
    
    it('debería lanzar ServerError si la operación de base de datos falla', async () => {
      data.users.findById.mockRejectedValue(new Error('Database error'))
      
      await expect(removeFromGameList('user123', '123', 'wishlist'))
        .rejects.toThrow('Database error')
    })
    
    it('debería lanzar ServerError si la operación de guardado falla', async () => {
      const mockUser = {
        _id: 'user123',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      }
      
      data.users.findById.mockResolvedValue(mockUser)
      
      await expect(removeFromGameList('user123', '123', 'wishlist'))
        .rejects.toThrow('Save error')
    })
    
    it('no debería modificar la lista si el juego no se encuentra', async () => {
      const mockUser = {
        _id: 'user123',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        save: jest.fn().mockResolvedValue(true)
      }
      
      data.users.findById.mockResolvedValue(mockUser)
      
      await removeFromGameList('user123', '456', 'wishlist')
      
      expect(mockUser.wishlist).toEqual([{ gameId: '123', gameName: 'Test Game' }])
      expect(mockUser.save).toHaveBeenCalled()
    })
  })
  
  describe('getGameList', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      data.users.findById = jest.fn()
      data.users.findOne = jest.fn()
    })
    
    it('debería obtener la lista de juegos por ID de usuario', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        privacy: { profileVisibility: 'public' }
      }
      
      data.users.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      })
      
      const result = await getGameList('user123', 'wishlist')
      
      expect(data.users.findById).toHaveBeenCalledWith('user123')
      
      expect(data.users.findById().select).toHaveBeenCalledWith('wishlist privacy username')
      
      expect(result).toEqual([{ gameId: '123', gameName: 'Test Game' }])
    })
    
    it('debería obtener la lista de juegos por nombre de usuario', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        privacy: { profileVisibility: 'public' }
      }
      
      data.users.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      })
      
      const result = await getGameList('testuser', 'wishlist', true)
      
      expect(data.users.findOne).toHaveBeenCalledWith({ username: 'testuser' })
      
      expect(data.users.findOne().select).toHaveBeenCalledWith('wishlist privacy username')
      
      expect(result).toEqual([{ gameId: '123', gameName: 'Test Game' }])
    })
    
    it('debería lanzar ValidationError para tipo de lista inválido', async () => {
      await expect(getGameList('user123', 'invalidList'))
        .rejects.toThrow('invalid list type')
    })
    
    it('debería lanzar ExistenceError si el usuario no se encuentra', async () => {
      data.users.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      })
      
      await expect(getGameList('user123', 'wishlist'))
        .rejects.toThrow('user not found')
    })
    
    it('debería lanzar AuthError si el perfil es privado', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        privacy: { profileVisibility: 'private' }
      }
      
      data.users.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      })
      
      await expect(getGameList('user123', 'wishlist'))
        .rejects.toThrow('profile is private')
    })
    
    it('debería lanzar ServerError si la operación de base de datos falla', async () => {
      data.users.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      })
      
      await expect(getGameList('user123', 'wishlist'))
        .rejects.toThrow('Database error')
    })
    
    it('debería devolver un array vacío para lista de juegos vacía', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        wishlist: [],
        privacy: { profileVisibility: 'public' }
      }
      
      data.users.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      })
      
      const result = await getGameList('user123', 'wishlist')
      
      expect(result).toEqual([])
    })
    
    it('debería manejar objeto privacy faltante', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        wishlist: [{ gameId: '123', gameName: 'Test Game' }],
        privacy: null
      }
      
      data.users.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      })
      
      const result = await getGameList('user123', 'wishlist')
      
      expect(result).toEqual([{ gameId: '123', gameName: 'Test Game' }])
    })
  })
})