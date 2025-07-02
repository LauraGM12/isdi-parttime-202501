import getToken from '../../helpers/getToken.js'

const API_URL = import.meta.env.VITE_API_URL

export const addComment = async (reviewId, content) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al añadir el comentario')
    }
    
    return await response.json()
}

export const getComments = async (reviewId) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/comments`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener los comentarios')
    }
    
    return await response.json()
}

export const deleteComment = async (reviewId, commentId) => {
    const token = getToken()
    
    const response = await fetch(`${API_URL}/reviews/${reviewId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al eliminar el comentario')
    }
    
    return await response.json()
}