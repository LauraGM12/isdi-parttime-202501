export const changePassword = async (currentPassword, newPassword, token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  
            },
            body: JSON.stringify({
                currentPassword,  
                newPassword      
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar la contraseña')
        }

        return data
    } catch (error) {
        throw error
    }
}