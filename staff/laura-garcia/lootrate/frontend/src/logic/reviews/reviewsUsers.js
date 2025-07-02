import getToken from '../../helpers/getToken.js'

const API_URL = import.meta.env.VITE_API_URL

export const createReview = async (gameId, content, rating) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId, content, rating })
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al crear la reseña')
    }
    
    return await response.json()
}

export const updateReview = async (reviewId, content, rating) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, rating })
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar la reseña')
    }
    
    return await response.json()
}

export const deleteReview = async (reviewId) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al eliminar la reseña')
    }
}