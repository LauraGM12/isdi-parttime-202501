// Importamos las clases de error desde el módulo común
import * as errors from '../../../../common/errors.js'

/**
 * Agrega un juego a una lista específica del usuario autenticado.
 * Esta función permite al usuario añadir juegos a sus listas personales
 * como "favoritos", "jugando", "completados", etc.
 * 
 * @async
 * @function addToGameList
 * @param {string|number} gameId - El ID único del juego
 * @param {string} listType - El tipo de lista (favorites, playing, completed, etc.)
 * @param {string} token - Token JWT del usuario autenticado
 * @param {Object} gameData - Datos adicionales del juego
 * @param {string} gameData.name - Nombre del juego
 * @param {string} gameData.background_image - URL de la imagen del juego
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación de adición
 * @throws {ValidationError} Cuando los datos no son válidos
 * @throws {DuplicityError} Cuando el juego ya está en la lista
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Agregar juego a lista de favoritos
 * try {
 *   const resultado = await addToGameList('12345', 'favorites', 'jwt_token', {
 *     name: 'The Witcher 3',
 *     background_image: 'https://example.com/image.jpg'
 *   })
 *   console.log('Juego agregado:', resultado)
 * } catch (error) {
 *   console.error('Error al agregar juego:', error.message)
 * }
 */
const addToGameList = async (gameId, listType, token, gameData) => {
    try {
        // Realizamos petición POST al endpoint de agregar a lista
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token para autenticación
            },
            body: JSON.stringify({ 
                gameData: {
                    gameId: gameId.toString(), // Convertimos el ID a string
                    gameName: gameData.name,
                    gameImage: gameData.background_image
                }, 
                listType 
            })
        })

        // Si la operación es exitosa (status 200)
        if (response.status === 200) {
            return await response.json() // Retornamos la confirmación
        } else {
            // Si hay error, extraemos el mensaje y creamos el error correspondiente
            const body = await response.json()
            const error = new Error(body.message)
            error.name = body.name
            throw error
        }
    } catch (error) {
        // Si es un error conocido de validación o duplicidad, lo propagamos
        if (error.name === 'ValidationError' || error.name === 'DuplicityError') {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        const serverError = new Error('Error al conectar con el servidor')
        serverError.name = 'ServerError'
        throw serverError
    }
}

/**
 * Remueve un juego de una lista específica del usuario autenticado.
 * Esta función permite al usuario quitar juegos de sus listas personales.
 * 
 * @async
 * @function removeFromGameList
 * @param {string|number} gameId - El ID único del juego a remover
 * @param {string} listType - El tipo de lista de la cual remover
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación de remoción
 * @throws {ValidationError} Cuando los datos no son válidos
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Remover juego de lista de favoritos
 * try {
 *   const resultado = await removeFromGameList('12345', 'favorites', 'jwt_token')
 *   console.log('Juego removido:', resultado)
 * } catch (error) {
 *   console.error('Error al remover juego:', error.message)
 * }
 */
const removeFromGameList = async (gameId, listType, token) => {
    try {
        // Realizamos petición DELETE al endpoint de remover de lista
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token para autenticación
            },
            body: JSON.stringify({ gameId, listType })
        })

        // Si la operación es exitosa (status 200)
        if (response.status === 200) {
            return await response.json() // Retornamos la confirmación
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de validación, lo propagamos
        if (error instanceof errors.ValidationError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

/**
 * Obtiene una lista específica de juegos de un usuario por su nombre de usuario.
 * Esta función permite ver las listas públicas de cualquier usuario
 * sin necesidad de autenticación.
 * 
 * @async
 * @function getGameList
 * @param {string} username - El nombre de usuario del propietario de la lista
 * @param {string} listType - El tipo de lista a obtener
 * @returns {Promise<Object>} Una promesa que resuelve con los juegos de la lista
 * @throws {ExistenceError} Cuando el usuario o la lista no existen
 * @throws {AuthError} Cuando hay problemas de autorización
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Obtener lista de favoritos de un usuario
 * try {
 *   const favoritos = await getGameList('nombreUsuario', 'favorites')
 *   console.log('Juegos favoritos:', favoritos)
 * } catch (error) {
 *   console.error('Error al obtener lista:', error.message)
 * }
 */
const getGameList = async (username, listType) => {
    try {
        // Realizamos petición GET al endpoint de lista pública
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/user/${username}/${listType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Si la respuesta es exitosa (status 200)
        if (response.status === 200) {
            return await response.json() // Retornamos la lista de juegos
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de existencia o autorización, lo propagamos
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

/**
 * Obtiene una lista específica de juegos del usuario autenticado.
 * Esta función permite al usuario obtener sus propias listas,
 * incluyendo información privada no visible en las listas públicas.
 * 
 * @async
 * @function getOwnGameList
 * @param {string} listType - El tipo de lista a obtener
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Una promesa que resuelve con los juegos de la lista propia
 * @throws {ExistenceError} Cuando la lista no existe
 * @throws {AuthError} Cuando el token no es válido
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Obtener mi lista de juegos completados
 * try {
 *   const completados = await getOwnGameList('completed', 'jwt_token')
 *   console.log('Mis juegos completados:', completados)
 * } catch (error) {
 *   console.error('Error al obtener mi lista:', error.message)
 * }
 */
const getOwnGameList = async (listType, token) => {
    try {
        // Realizamos petición GET autenticada al endpoint de lista propia
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/own/${listType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token para autenticación
            }
        })

        // Si la respuesta es exitosa (status 200)
        if (response.status === 200) {
            return await response.json() // Retornamos la lista de juegos
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de existencia o autorización, lo propagamos
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

// Exportamos todas las funciones de listas de juegos
export { addToGameList, removeFromGameList, getGameList, getOwnGameList }