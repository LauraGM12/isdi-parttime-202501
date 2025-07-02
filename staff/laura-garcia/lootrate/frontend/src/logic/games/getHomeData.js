import { errors } from 'common'

const getHomeData = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/games/home`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener datos del home')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError) {
            throw error
        }
        throw new errors.ServerError('Error de red al obtener datos del home')
    })
}

const searchGames = (query, page = 1) => {
    if (!query || query.trim().length === 0) {
        throw new errors.ValidationError('La consulta de búsqueda es requerida')
    }

    const url = new URL(`${import.meta.env.VITE_API_URL}/games/search`)
    url.searchParams.append('q', query.trim()) 
    url.searchParams.append('page', page)

    return fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al buscar juegos')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError || error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError('Error de red al buscar juegos')
    })
}

export {
    getHomeData,
    searchGames
}