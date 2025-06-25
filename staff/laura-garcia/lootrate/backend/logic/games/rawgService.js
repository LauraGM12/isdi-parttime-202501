import { errors } from 'common'

// Función auxiliar para hacer peticiones a RAWG con reintentos
const makeRawgRequest = async (endpoint, params = {}, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Obtenemos las configuraciones de la API en cada llamada
            const apiKey = process.env.RAWG_API_KEY
            let baseUrl = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api/'
            
            // Aseguramos que la URL base termine con una barra
            if (!baseUrl.endsWith('/')) {
                baseUrl = `${baseUrl}/`
            }
            
            // Verificar que apiKey esté definido
            if (!apiKey) {
                throw new Error('RAWG_API_KEY no está definida')
            }
            
            // Construimos la URL con los parámetros
            const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint
            const url = new URL(`${baseUrl}${path}`)
            
            url.searchParams.append('key', apiKey)
            
            // Agregamos parámetros adicionales
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value)
                }
            })

            // Realizamos la petición
            const response = await fetch(url.toString())
            
            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error de API RAWG: ${response.status} ${response.statusText}`)
            }

            // Retornamos los datos en formato JSON
            return await response.json()
        } catch (error) {
            lastError = error;
            console.log(`Intento ${attempt + 1}/${maxRetries} fallido: ${error.message}`);
            
            // Si no es el último intento, esperamos antes de reintentar
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    throw new errors.ServerError(`Error al obtener datos de la API RAWG: ${lastError.message}`)
}

// Obtener juegos populares/destacados
const getFeaturedGames = async (page = 1, pageSize = 20) => {
// Obtenemos juegos ordenados por rating y popularidad
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        ordering: '-rating,-added', // Ordenar por rating y popularidad
        metacritic: '80,100' // Solo juegos con buena puntuación
    })
}

// Obtener juegos por género
const getGamesByGenre = async (genreId, page = 1, pageSize = 20) => {
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        genres: genreId,
        ordering: '-rating'
    })
}

// Obtener enlaces de tiendas para un juego
const getGameStores = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}/stores`)
}

// Obtener detalles completos de un juego
const getGameDetails = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}`)
}

// Obtener géneros disponibles
const getGenres = async () => {
    return await makeRawgRequest('/genres')
}

// Obtener plataformas disponibles
const getPlatforms = async () => {
    return await makeRawgRequest('/platforms')
}

// Buscar juegos por nombre
const searchGames = async (query, page = 1, pageSize = 20) => {
    return await makeRawgRequest('/games', {
        search: query,
        page,
        page_size: pageSize,
        ordering: '-rating'
    })
}

// Obtener juegos próximos a lanzarse
const getUpcomingGames = async (page = 1, pageSize = 20) => {
    const today = new Date().toISOString().split('T')[0]
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        dates: `${today},${nextYear}`,
        ordering: '-added',
        page,
        page_size: pageSize
    })
}

// Obtener screenshots de un juego
const getGameScreenshots = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}/screenshots`)
}

// Obtener juegos trending (populares recientes)
const getTrendingGames = async (page = 1, pageSize = 20) => {
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        dates: `${lastMonth},${today}`,
        ordering: '-added,-rating',
        page,
        page_size: pageSize
    })
}

// Obtener nuevos lanzamientos
const getNewReleases = async (page = 1, pageSize = 20) => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        dates: `${lastWeek},${today}`,
        ordering: '-released',
        page,
        page_size: pageSize
    })
}

// Obtener juegos mejor valorados
const getTopRatedGames = async (page = 1, pageSize = 20) => {
    return await makeRawgRequest('/games', {
        ordering: '-metacritic,-rating',
        metacritic: '85,100',
        page,
        page_size: pageSize
    })
}

// Obtener juegos por plataforma
const getGamesByPlatform = async (platformId, page = 1, pageSize = 20) => {
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        platforms: platformId,
        ordering: '-rating'
    })
}

export {
    getFeaturedGames,
    getGamesByGenre,
    getGameDetails,
    getGenres,
    getPlatforms,
    searchGames,
    getUpcomingGames,
    getGameScreenshots,
    getGameStores,
    getTrendingGames,     
    getNewReleases,      
    getTopRatedGames,
    getGamesByPlatform     
}