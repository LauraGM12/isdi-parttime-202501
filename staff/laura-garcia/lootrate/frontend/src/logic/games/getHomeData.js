import * as errors from '../../../../common/errors.js'

/**
 * Obtiene los datos principales para la página de inicio desde el backend.
 * Esta función realiza una petición HTTP GET al endpoint de home del API
 * para recuperar información como juegos destacados, categorías populares,
 * y otros datos necesarios para renderizar la página principal.
 * 
 * @async
 * @function getHomeData
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del home
 * @throws {ServerError} Cuando hay un error del servidor o de red
 * 
 * @example
 * // Obtener datos del home
 * try {
 *   const homeData = await getHomeData()
 *   console.log('Datos del home:', homeData)
 * } catch (error) {
 *   console.error('Error al obtener datos del home:', error.message)
 * }
 */
const getHomeData = () => {
    // Realizamos petición HTTP GET al endpoint del home
    return fetch(`${import.meta.env.VITE_API_APP}/api/games/home`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificamos si la respuesta HTTP es exitosa (status 200-299)
        if (!response.ok) {
            // Si hay error, extraemos el mensaje del cuerpo de la respuesta
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener datos del home')
            })
        }
        // Si la respuesta es exitosa, retornamos los datos en formato JSON
        return response.json()
    })
    .catch(error => {
        // Si es un error conocido de nuestro sistema, lo propagamos tal como está
        if (error instanceof errors.ServerError) {
            throw error
        }
        // Si es un error de red u otro tipo, lo envolvemos en un ServerError
        throw new errors.ServerError('Error de red al obtener datos del home')
    })
}

/**
 * Busca juegos en el sistema utilizando una consulta de texto.
 * Esta función permite realizar búsquedas paginadas de juegos
 * basándose en el nombre, descripción u otros criterios de búsqueda.
 * 
 * @async
 * @function searchGames
 * @param {string} query - La consulta de búsqueda (nombre del juego, género, etc.)
 * @param {number} [page=1] - El número de página para la paginación (por defecto 1)
 * @returns {Promise<Object>} Una promesa que resuelve con los resultados de búsqueda
 * @throws {ValidationError} Cuando la consulta de búsqueda está vacía o es inválida
 * @throws {ServerError} Cuando hay un error del servidor o de red
 * 
 * @example
 * // Buscar juegos por nombre
 * try {
 *   const resultados = await searchGames('Call of Duty', 1)
 *   console.log('Juegos encontrados:', resultados)
 * } catch (error) {
 *   if (error instanceof errors.ValidationError) {
 *     console.error('Error de validación:', error.message)
 *   } else {
 *     console.error('Error del servidor:', error.message)
 *   }
 * }
 */
const searchGames = (query, page = 1) => {
    // Validamos que la consulta de búsqueda no esté vacía
    if (!query || query.trim().length === 0) {
        throw new errors.ValidationError('La consulta de búsqueda es requerida')
    }

    // Construimos la URL del endpoint con los parámetros de búsqueda
    // Nota: Corregido VITE_API_URL en lugar de VITE_API_APP para consistencia
    const url = new URL(`${import.meta.env.VITE_API_URL}/games/search`)
    url.searchParams.append('q', query.trim()) // Añadimos la consulta limpia
    url.searchParams.append('page', page)      // Añadimos el número de página

    // Realizamos la petición HTTP GET con los parámetros construidos
    return fetch(url.toString(), {
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
                throw new errors.ServerError(body.error || 'Error al buscar juegos')
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
        throw new errors.ServerError('Error de red al buscar juegos')
    })
}

// Exportamos las funciones para su uso en otros módulos
export {
    getHomeData,
    searchGames
}