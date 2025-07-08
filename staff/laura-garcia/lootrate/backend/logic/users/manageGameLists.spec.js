import { expect } from 'chai'
import sinon from 'sinon'
import { data } from '../../data/index.js'
import { errors } from 'common'
import { addToGameList, removeFromGameList, getGameList } from './manageGameLists.js'

describe('manageGameLists', () => {
  let findByIdStub, findOneStub, saveStub

  beforeEach(() => {
    findByIdStub = sinon.stub(data.users, 'findById')
    findOneStub = sinon.stub(data.users, 'findOne')
    saveStub = sinon.stub()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('addToGameList', () => {
    describe('casos exitosos', () => {
      it('debería agregar juego a wishlist correctamente', async () => {
        const userId = 'userId123'
        const gameData = {
          gameId: 'game123',
          gameName: 'Test Game',
          gameImage: 'image.jpg'
        }
        const user = {
          _id: userId,
          wishlist: [],
          save: saveStub
        }

        findByIdStub.resolves(user)
        saveStub.resolves()

        const result = await addToGameList(userId, gameData, 'wishlist')

        expect(findByIdStub.calledOnceWith(userId)).to.be.true
        expect(user.wishlist).to.have.lengthOf(1)
        expect(user.wishlist[0]).to.deep.equal({
          gameId: 'game123',
          gameName: 'Test Game',
          gameImage: 'image.jpg'
        })
        expect(saveStub.calledOnce).to.be.true
        expect(result).to.deep.equal({
          action: 'added',
          message: 'Juego agregado a wishlist'
        })
      })

      it('debería agregar juego a currentlyPlaying con hoursPlayed', async () => {
        const userId = 'userId123'
        const gameData = {
          gameId: 'game123',
          gameName: 'Test Game'
        }
        const user = {
          _id: userId,
          currentlyPlaying: [],
          save: saveStub
        }

        findByIdStub.resolves(user)
        saveStub.resolves()

        await addToGameList(userId, gameData, 'currentlyPlaying')

        expect(user.currentlyPlaying[0]).to.deep.equal({
          gameId: 'game123',
          gameName: 'Test Game',
          gameImage: null,
          hoursPlayed: 0
        })
      })

      it('debería agregar juego a completedGames con rating', async () => {
        const userId = 'userId123'
        const gameData = {
          gameId: 'game123',
          gameName: 'Test Game',
          rating: 5
        }
        const user = {
          _id: userId,
          completedGames: [],
          save: saveStub
        }

        findByIdStub.resolves(user)
        saveStub.resolves()

        await addToGameList(userId, gameData, 'completedGames')

        expect(user.completedGames[0]).to.deep.equal({
          gameId: 'game123',
          gameName: 'Test Game',
          gameImage: null,
          rating: 5
        })
      })
    })

    describe('validaciones y errores', () => {
      it('debería lanzar ValidationError para tipo de lista inválido', async () => {
        try {
          await addToGameList('userId', {}, 'invalidList')
          expect.fail('Debería haber lanzado ValidationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ValidationError)
          expect(error.message).to.equal('invalid list type')
        }
      })

      it('debería lanzar ValidationError si falta gameId', async () => {
        try {
          await addToGameList('userId', { gameName: 'Test' }, 'wishlist')
          expect.fail('Debería haber lanzado ValidationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ValidationError)
          expect(error.message).to.equal('gameId and gameName are required')
        }
      })

      it('debería lanzar ValidationError si falta gameName', async () => {
        try {
          await addToGameList('userId', { gameId: '123' }, 'wishlist')
          expect.fail('Debería haber lanzado ValidationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ValidationError)
          expect(error.message).to.equal('gameId and gameName are required')
        }
      })

      it('debería lanzar ExistenceError si el usuario no existe', async () => {
        findByIdStub.resolves(null)

        try {
          await addToGameList('nonexistentId', { gameId: '123', gameName: 'Test' }, 'wishlist')
          expect.fail('Debería haber lanzado ExistenceError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ExistenceError)
          expect(error.message).to.equal('user not found')
        }
      })

      it('debería lanzar DuplicityError si el juego ya está en la lista', async () => {
        const user = {
          _id: 'userId123',
          wishlist: [{ gameId: 'game123', gameName: 'Existing Game' }],
          save: saveStub  
        }

        findByIdStub.resolves(user)

        try {
          await addToGameList('userId123', { gameId: 'game123', gameName: 'Test' }, 'wishlist')
          expect.fail('Debería haber lanzado DuplicityError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.DuplicityError)
          expect(error.message).to.equal('game already in list')
        }
      })
    })
  })

  describe('removeFromGameList', () => {
    describe('casos exitosos', () => {
      it('debería remover juego de la lista correctamente', async () => {
        const userId = 'userId123'
        const gameId = 'game123'
        const user = {
          _id: userId,
          wishlist: [
            { gameId: 'game123', gameName: 'Game to Remove' },
            { gameId: 'game456', gameName: 'Game to Keep' }
          ],
          save: saveStub
        }

        findByIdStub.resolves(user)
        saveStub.resolves()

        await removeFromGameList(userId, gameId, 'wishlist')

        expect(findByIdStub.calledOnceWith(userId)).to.be.true
        expect(user.wishlist).to.have.lengthOf(1)
        expect(user.wishlist[0].gameId).to.equal('game456')
        expect(saveStub.calledOnce).to.be.true
      })
    })

    describe('validaciones y errores', () => {
      it('debería lanzar ValidationError para tipo de lista inválido', async () => {
        try {
          await removeFromGameList('userId', 'gameId', 'invalidList')
          expect.fail('Debería haber lanzado ValidationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ValidationError)
          expect(error.message).to.equal('invalid list type')
        }
      })

      it('debería lanzar ExistenceError si el usuario no existe', async () => {
        findByIdStub.resolves(null)

        try {
          await removeFromGameList('nonexistentId', 'gameId', 'wishlist')
          expect.fail('Debería haber lanzado ExistenceError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ExistenceError)
          expect(error.message).to.equal('user not found')
        }
      })
    })
  })

  describe('getGameList', () => {
    describe('casos exitosos', () => {
      it('debería obtener lista de juegos por userId', async () => {
        const userId = 'userId123'
        const selectStub = sinon.stub().resolves({
          _id: userId,
          username: 'testuser',
          wishlist: [
            { gameId: 'game123', gameName: 'Test Game' },
            null // Debería ser filtrado
          ],
          privacy: { profileVisibility: 'public' }
        })

        findByIdStub.returns({ select: selectStub })

        const result = await getGameList(userId, 'wishlist', false)

        expect(findByIdStub.calledOnceWith(userId)).to.be.true
        expect(selectStub.calledOnceWith('wishlist privacy username')).to.be.true
        expect(result).to.have.lengthOf(1)
        expect(result[0]).to.deep.equal({ gameId: 'game123', gameName: 'Test Game' })
      })

      it('debería obtener lista de juegos por username', async () => {
        const username = 'testuser'
        const selectStub = sinon.stub().resolves({
          _id: 'userId123',
          username: username,
          wishlist: [{ gameId: 'game123', gameName: 'Test Game' }],
          privacy: { profileVisibility: 'public' }
        })

        findOneStub.returns({ select: selectStub })

        const result = await getGameList(username, 'wishlist', true)

        expect(findOneStub.calledOnceWith({ username: username })).to.be.true
        expect(selectStub.calledOnceWith('wishlist privacy username')).to.be.true
        expect(result).to.have.lengthOf(1)
      })
    })

    describe('validaciones y errores', () => {
      it('debería lanzar ValidationError para tipo de lista inválido', async () => {
        try {
          await getGameList('userId', 'invalidList')
          expect.fail('Debería haber lanzado ValidationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ValidationError)
          expect(error.message).to.equal('invalid list type')
        }
      })

      it('debería lanzar ExistenceError si el usuario no existe', async () => {
        const selectStub = sinon.stub().resolves(null)
        findByIdStub.returns({ select: selectStub })

        try {
          await getGameList('nonexistentId', 'wishlist')
          expect.fail('Debería haber lanzado ExistenceError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.ExistenceError)
          expect(error.message).to.equal('user not found')
        }
      })

      it('debería lanzar AuthorizationError si el perfil es privado', async () => {
        const selectStub = sinon.stub().resolves({
          _id: 'userId123',
          username: 'testuser',
          wishlist: [],
          privacy: { profileVisibility: 'private' }
        })

        findByIdStub.returns({ select: selectStub })

        try {
          await getGameList('userId123', 'wishlist')
          expect.fail('Debería haber lanzado AuthorizationError')
        } catch (error) {
          expect(error).to.be.instanceOf(errors.AuthorizationError)
          expect(error.message).to.equal('profile is private')
        }
      })
    })
  })
})