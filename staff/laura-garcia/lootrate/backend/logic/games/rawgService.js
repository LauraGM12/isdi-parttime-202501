import { errors } from 'common'
import axios from 'axios'

const makeRawgRequest = async (endpoint, params = {}, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const apiKey = process.env.RAWG_API_KEY
            let baseUrl = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api/'
            
            if (!baseUrl.endsWith('/')) {
                baseUrl = `${baseUrl}/`
            }
            
            if (!apiKey) {
                throw new Error('RAWG_API_KEY no está definida')
            }
            
            const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint
            const url = `${baseUrl}${path}`
            
            const queryParams = {
                key: apiKey,
                ...params
            }
            
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] === undefined || queryParams[key] === null) {
                    delete queryParams[key]
                }
            })

            const response = await axios.get(url, {
                params: queryParams,
                timeout: 10000
            })
            
            return response.data
        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }
    
    throw new errors.ServerError(`Error al obtener datos de la API RAWG: ${lastError.message}`)
}

const getFeaturedGames = async (page = 1, pageSize = 20) => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        ordering: '-rating,-added', 
        metacritic: '80,100', 
        dates: `${twoYearsAgo},${today}` 
        })
}

const getGamesByGenre = async (genreId, page = 1, pageSize = 20) => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        genres: genreId,
        ordering: '-rating', 
        dates: `${twoYearsAgo},${today}` 
    })
}

const getGameStores = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}/stores`)
}

const getGameDetails = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}`)
}

const getGenres = async () => {
    return await makeRawgRequest('/genres')
}

const getPlatforms = async () => {
    return await makeRawgRequest('/platforms')
}

const searchGames = async (query, page = 1, pageSize = 20) => {
    return await makeRawgRequest('/games', {
        search: query,
        page,
        page_size: pageSize,
        ordering: '-rating' 
    })
}

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

const getGameScreenshots = async (gameId) => {
    return await makeRawgRequest(`/games/${gameId}/screenshots`)
}

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

const getTopRatedGames = async (page = 1, pageSize = 20) => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        ordering: '-metacritic,-rating', 
        metacritic: '85,100', 
        dates: `${twoYearsAgo},${today}`, 
        page,
        page_size: pageSize
    })
}

const getGamesByPlatform = async (platformId, page = 1, pageSize = 20) => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    return await makeRawgRequest('/games', {
        page,
        page_size: pageSize,
        platforms: platformId,
        ordering: '-rating', 
        dates: `${twoYearsAgo},${today}` 
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