const API_URL = import.meta.env.VITE_API_URL

export const getGameReviews = async (gameId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc') => {
    if (!gameId || gameId === 'undefined') {
        throw new Error('El ID del juego es requerido y no puede estar indefinido')
    }
    
    const response = await fetch(`${API_URL}/reviews/game/${gameId}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener las reseñas')
    }
    
    return await response.json()
}