import getToken from '../../helpers/getToken.js'
import { jwtDecode } from 'jwt-decode'

const API_URL = import.meta.env.VITE_API_URL

export const getUserReviews = async (userId, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/reviews/user/${userId}?page=${page}&limit=${limit}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener las reseñas del usuario')
    }
    
    return await response.json()
}

export const getOwnReviews = async (page = 1, limit = 10) => {
    const token = getToken()
    
    if (!token) {
        throw new Error('No hay token de autenticación')
    }
    
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.id
    
    const response = await fetch(`${API_URL}/reviews/user/${userId}?page=${page}&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener tus reseñas')
    }
    
    return await response.json()
}