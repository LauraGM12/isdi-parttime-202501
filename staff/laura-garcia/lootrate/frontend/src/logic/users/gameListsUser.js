import { errors } from 'common'

const addToGameList = async (gameId, listType, token, gameData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                gameData: {
                    gameId: gameId.toString(),
                    gameName: gameData.name, 
                    gameImage: gameData.background_image
                }, 
                listType 
            })
        })

        if (response.status === 200) {
            return await response.json()
        } else {
            const body = await response.json()
            const error = new Error(body.message)
            error.name = body.name
            throw error
        }
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'DuplicityError') {
            throw error
        }
        const serverError = new Error('Error al conectar con el servidor')
        serverError.name = 'ServerError'
        throw serverError
    }
}

const removeFromGameList = async (gameId, listType, token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ gameId, listType })
        })

        if (response.status === 200) {
            return await response.json() 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

const getGameList = async (username, listType) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/user/${username}/${listType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            return await response.json() 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

const getOwnGameList = async (listType, token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/lists/own/${listType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })

        if (response.status === 200) {
            return await response.json() 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

export { addToGameList, removeFromGameList, getGameList, getOwnGameList }