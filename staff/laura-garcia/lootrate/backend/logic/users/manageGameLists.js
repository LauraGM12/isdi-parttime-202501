import { errors } from "common"
import { data } from "../../data/index.js"

// Función para agregar un juego a una lista específica (con toggle)
const addToGameList = (userId, gameData, listType) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames']
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('invalid list type')
    }

    // Validar que gameData tenga las propiedades necesarias
    if (!gameData.gameId || !gameData.gameName) {
        throw new errors.ValidationError('gameId and gameName are required')
    }

    return data.users.findById(userId)
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            
            // Filtrar elementos null antes de verificar duplicados
            const existingGameIndex = user[listType].findIndex(game => 
                game !== null && game.gameId === gameData.gameId.toString()
            )
            
            if (existingGameIndex !== -1) {
                // Si el juego ya existe, lo quitamos (toggle)
                user[listType].splice(existingGameIndex, 1)
                return user.save()
                    .then(() => ({ action: 'removed', message: `Juego eliminado de ${listType}` }))
                    .catch(error => { throw new errors.ServerError(error.message) })
            }
            
            // Si no existe, lo agregamos
            const gameEntry = {
                gameId: gameData.gameId.toString(),
                gameName: gameData.gameName,
                gameImage: gameData.gameImage || null
            }

            // Añadir propiedades específicas según el tipo de lista
            if (listType === 'currentlyPlaying') {
                gameEntry.hoursPlayed = 0
            } else if (listType === 'completedGames') {
                gameEntry.rating = gameData.rating || null
            }
            
            // Agregar el juego a la lista
            user[listType].push(gameEntry)
            
            return user.save()
                .then(() => ({ action: 'added', message: `Juego agregado a ${listType}` }))
                .catch(error => { throw new errors.ServerError(error.message) })
        })
}

// Función para quitar un juego de una lista específica (parámetros corregidos)
const removeFromGameList = (userId, listType, gameId) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames'];
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('invalid list type');
    }

    return data.users.findById(userId)
        .catch(error => { throw new errors.ServerError(error.message); })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found'); }
            
            // Quitar el juego de la lista filtrando por gameId
            user[listType] = user[listType].filter(game => 
                game && game.gameId !== gameId.toString()
            );
            
            return user.save()
                .catch(error => { throw new errors.ServerError(error.message); });
        });
};

// Función para obtener una lista específica de juegos de un usuario
const getGameList = (userIdentifier, listType, isUsername = false) => {
    const validListTypes = ['wishlist', 'currentlyPlaying', 'completedGames']
    
    if (!validListTypes.includes(listType)) {
        throw new errors.ValidationError('tipo de lista inválido')
    }

    // Determinar cómo buscar al usuario (por ID o por nombre de usuario)
    const findUserPromise = isUsername 
        ? data.users.findOne({ username: userIdentifier })
        : data.users.findById(userIdentifier)

    return findUserPromise
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('usuario no encontrado') }
            
            // Devolver la lista de juegos solicitada
            return {
                success: true,
                listType,
                games: user[listType].filter(game => game !== null) // Filtrar elementos nulos
            }
        })
}

export { addToGameList, removeFromGameList, getGameList }