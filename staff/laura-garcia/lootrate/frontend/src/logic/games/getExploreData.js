import * as errors from '../../../../common/errors.js'

/**
 * Obtiene juegos por género desde el backend.
 * 
 * @async
 * @function getGamesByGenre
 * @param {string} genreSlug - El slug del género a buscar
 * @param {number} [page=1] - El número de página para la paginación
 * @returns {Promise<Object>} Una promesa que resuelve con los juegos del género
 * @throws {ServerError} Cuando hay un error del servidor o de red
 */
const getGamesByGenre = (genreSlug, page = 1) => {
    // Validamos que el género no esté vacío
    if (!genreSlug || genreSlug.trim().length === 0) {
        throw new errors.ValidationError('El género es requerido')
    }

    // Realizamos petición HTTP GET al endpoint de juegos por género
    return fetch(`${import.meta.env.VITE_API_URL}/games/genre/${genreSlug}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificamos si la respuesta HTTP es exitosa
        if (!response.ok) {
            // Si hay error, extraemos el mensaje del cuerpo de la respuesta
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener juegos por género')
            })
        }
        // Si la respuesta es exitosa, retornamos los datos en formato JSON
        return response.json()
    })
    .catch(error => {
        // Si es un error conocido de nuestro sistema, lo propagamos
        if (error instanceof errors.ServerError || error instanceof errors.ValidationError) {
            throw error
        }
        // Si es un error de red u otro tipo, lo envolvemos en un ServerError
        throw new errors.ServerError('Error de red al obtener juegos por género')
    })
}

/**
 * Obtiene juegos por plataforma desde el backend.
 * 
 * @async
 * @function getGamesByPlatform
 * @param {string} platformId - El ID de la plataforma a buscar
 * @param {number} [page=1] - El número de página para la paginación
 * @returns {Promise<Object>} Una promesa que resuelve con los juegos de la plataforma
 * @throws {ServerError} Cuando hay un error del servidor o de red
 */
const getGamesByPlatform = (platformId, page = 1) => {
    // Convertimos a string y validamos que la plataforma no esté vacía o inválida
    const platformIdStr = String(platformId);
    if (!platformId || (typeof platformIdStr === 'string' && platformIdStr.trim().length === 0)) {
        throw new errors.ValidationError('La plataforma es requerida')
    }

    // Realizamos petición HTTP GET al endpoint de juegos por plataforma
    return fetch(`${import.meta.env.VITE_API_URL}/games/platform/${platformId}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificamos si la respuesta HTTP es exitosa
        if (!response.ok) {
            // Si hay error, extraemos el mensaje del cuerpo de la respuesta
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener juegos por plataforma')
            })
        }
        // Si la respuesta es exitosa, retornamos los datos en formato JSON
        return response.json()
    })
    .catch(error => {
        // Si es un error conocido de nuestro sistema, lo propagamos
        if (error instanceof errors.ServerError || error instanceof errors.ValidationError) {
            throw error
        }
        // Si es un error de red u otro tipo, lo envolvemos en un ServerError
        throw new errors.ServerError('Error de red al obtener juegos por plataforma')
    })
}

/**
 * Obtiene los géneros disponibles desde el backend.
 * 
 * @async
 * @function getGenres
 * @returns {Promise<Object>} Una promesa que resuelve con los géneros disponibles
 * @throws {ServerError} Cuando hay un error del servidor o de red
 */
const getGenres = () => {
    // Realizamos petición HTTP GET al endpoint de géneros
    return fetch(`${import.meta.env.VITE_API_URL}/games/genres`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificamos si la respuesta HTTP es exitosa
        if (!response.ok) {
            // Si hay error, extraemos el mensaje del cuerpo de la respuesta
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener géneros')
            })
        }
        // Si la respuesta es exitosa, retornamos los datos en formato JSON
        return response.json()
    })
    .catch(error => {
        // Si es un error conocido de nuestro sistema, lo propagamos
        if (error instanceof errors.ServerError) {
            throw error
        }
        // Si es un error de red u otro tipo, lo envolvemos en un ServerError
        throw new errors.ServerError('Error de red al obtener géneros')
    })
}

/**
 * Obtiene las plataformas disponibles desde el backend.
 * 
 * @async
 * @function getPlatforms
 * @returns {Promise<Object>} Una promesa que resuelve con las plataformas disponibles
 * @throws {ServerError} Cuando hay un error del servidor o de red
 */
const getPlatforms = () => {
    // Realizamos petición HTTP GET al endpoint de plataformas
    return fetch(`${import.meta.env.VITE_API_URL}/games/platforms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificamos si la respuesta HTTP es exitosa
        if (!response.ok) {
            // Si hay error, extraemos el mensaje del cuerpo de la respuesta
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener plataformas')
            })
        }
        // Si la respuesta es exitosa, retornamos los datos en formato JSON
        return response.json()
    })
    .catch(error => {
        // Si es un error conocido de nuestro sistema, lo propagamos
        if (error instanceof errors.ServerError) {
            throw error
        }
        // Si es un error de red u otro tipo, lo envolvemos en un ServerError
        throw new errors.ServerError('Error de red al obtener plataformas')
    })
}

// Exportamos las funciones para su uso en otros módulos
export {
    getGamesByGenre,
    getGamesByPlatform,
    getGenres,
    getPlatforms
}