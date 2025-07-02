const createReview = async (gameId, content, rating, token) => {
    try {
        if (!gameId || !content || !rating || !token) {
            throw new Error('Todos los parámetros son requeridos')
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                gameId: gameId.toString(),
                content, 
                rating 
            })
        })
        
        if (response.status === 200 || response.status === 201) {
            return await response.json()
        } else {
            const errorData = await response.json()
            const error = new Error(errorData.message || 'Error del servidor')
            error.name = errorData.name || 'ServerError'
            error.status = response.status
            throw error
        }
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            const networkError = new Error('Error de conexión con el servidor')
            networkError.name = 'NetworkError'
            throw networkError
        }
        throw error
    }
}
