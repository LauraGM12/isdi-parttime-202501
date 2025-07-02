import { errors } from "common"
import { data } from "../../data/index.js"

const addToGameList = (userId, gameData, listType) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames']
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('invalid list type')
    }

    if (!gameData.gameId || !gameData.gameName) {
        throw new errors.ValidationError('gameId and gameName are required')
    }

    return data.users.findById(userId)
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            
            const existingGameIndex = user[listType].findIndex(game => 
                game !== null && game.gameId === gameData.gameId.toString()
            )
            
            if (existingGameIndex !== -1) {
                user[listType].splice(existingGameIndex, 1)
                return user.save()
                    .then(() => ({ action: 'removed', message: `Juego eliminado de ${listType}` }))
                    .catch(error => { throw new errors.ServerError(error.message) })
            }
            
            const gameEntry = {
                gameId: gameData.gameId.toString(),
                gameName: gameData.gameName,
                gameImage: gameData.gameImage || null
            }

            if (listType === 'currentlyPlaying') {
                gameEntry.hoursPlayed = 0
            } else if (listType === 'completedGames') {
                gameEntry.rating = gameData.rating || null
            }
            
            user[listType].push(gameEntry)
            
            return user.save()
                .then(() => ({ action: 'added', message: `Juego agregado a ${listType}` }))
                .catch(error => { throw new errors.ServerError(error.message) })
        })
}

const removeFromGameList = (userId, listType, gameId) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames'];
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('invalid list type');
    }

    return data.users.findById(userId)
        .catch(error => { throw new errors.ServerError(error.message); })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found'); }
            
            user[listType] = user[listType].filter(game => 
                game && game.gameId !== gameId.toString()
            );
            
            return user.save()
                .catch(error => { throw new errors.ServerError(error.message); });
        });
};

const getGameList = (userIdentifier, listType, isUsername = false) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames']
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('tipo de lista inválido')
    }

    const findUserPromise = isUsername 
        ? data.users.findOne({ username: userIdentifier })
        : data.users.findById(userIdentifier)

    return findUserPromise
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('usuario no encontrado') }
            
            return {
                success: true,
                listType,
                games: user[listType].filter(game => game !== null) 
            }
        })
}

export { addToGameList, removeFromGameList, getGameList }