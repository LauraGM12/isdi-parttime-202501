import { errors } from 'common'

const API_URL = import.meta.env.VITE_API_URL

export const deleteUserAccount = async (email, password, token) => {
    const response = await fetch(`${API_URL}/users/account`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password }) 
    })
    
    if (!response.ok) {
        const errorData = await response.json()
        throw new errors.ServerError(errorData.message || 'Error al eliminar la cuenta')
    }
    
    return await response.json()
}