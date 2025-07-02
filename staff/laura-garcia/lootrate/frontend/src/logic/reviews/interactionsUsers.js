import getToken from '../../helpers/getToken.js'

const API_URL = import.meta.env.VITE_API_URL

export const toggleLike = async (reviewId) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al procesar el like')
    }
    
    return await response.json()
}

export const toggleHelpful = async (reviewId) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al marcar como útil')
    }
    
    return await response.json()
}