import { errors } from 'common'

const getGamesByGenre = (genreSlug, page = 1) => {
    if (!genreSlug || genreSlug.trim().length === 0) {
        throw new errors.ValidationError('El género es requerido')
    }

    return fetch(`${import.meta.env.VITE_API_URL}/games/genre/${genreSlug}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener juegos por género')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError || error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError('Error de red al obtener juegos por género')
    })
}

const getGamesByPlatform = (platformId, page = 1) => {
    const platformIdStr = String(platformId);
    if (!platformId || (typeof platformIdStr === 'string' && platformIdStr.trim().length === 0)) {
        throw new errors.ValidationError('La plataforma es requerida')
    }

    return fetch(`${import.meta.env.VITE_API_URL}/games/platform/${platformId}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener juegos por plataforma')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError || error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError('Error de red al obtener juegos por plataforma')
    })
}

const getGenres = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/games/genres`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener géneros')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError) {
            throw error
        }
        throw new errors.ServerError('Error de red al obtener géneros')
    })
}

const getPlatforms = () => {
    return fetch(`${import.meta.env.VITE_API_URL}/games/platforms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(body => {
                throw new errors.ServerError(body.error || 'Error al obtener plataformas')
            })
        }
        return response.json()
    })
    .catch(error => {
        if (error instanceof errors.ServerError) {
            throw error
        }
        throw new errors.ServerError('Error de red al obtener plataformas')
    })
}

export {
    getGamesByGenre,
    getGamesByPlatform,
    getGenres,
    getPlatforms
}