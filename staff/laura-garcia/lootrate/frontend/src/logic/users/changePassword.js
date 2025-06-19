/**
 * Función para cambiar la contraseña del usuario
 * @param {string} currentPassword - Contraseña actual del usuario
 * @param {string} newPassword - Nueva contraseña del usuario
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise} - Promesa que resuelve con el resultado del cambio
 */
export const changePassword = async (currentPassword, newPassword, token) => {
    try {
        // Realizar petición PUT al endpoint de cambio de contraseña
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Incluir token de autenticación
            },
            body: JSON.stringify({
                currentPassword,  // Contraseña actual
                newPassword       // Nueva contraseña
            })
        })

        // Parsear la respuesta JSON
        const data = await response.json()

        // Si la respuesta no es exitosa, lanzar error con el mensaje del servidor
        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar la contraseña')
        }

        // Retornar los datos de éxito
        return data
    } catch (error) {
        // Re-lanzar el error para que sea manejado por el componente
        throw error
    }
}