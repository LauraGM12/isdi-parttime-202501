import * as errors from '../../../../common/errors.js'

// URL base del API obtenida desde las variables de entorno con fallback
const API_URL = import.meta.env.VITE_API_APP || 'http://localhost:3001'

/**
 * Elimina permanentemente la cuenta de usuario del sistema.
 * Esta función requiere confirmación mediante email y contraseña
 * para garantizar la seguridad de la operación de eliminación.
 * 
 * @async
 * @function deleteUserAccount
 * @param {string} email - El email del usuario para confirmación
 * @param {string} password - La contraseña del usuario para confirmación
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación de eliminación
 * @throws {Error} Cuando las credenciales son incorrectas o hay un error del servidor
 * 
 * @example
 * // Eliminar cuenta de usuario
 * try {
 *   const resultado = await deleteUserAccount('user@email.com', 'password123', 'jwt_token')
 *   console.log('Cuenta eliminada:', resultado)
 * } catch (error) {
 *   console.error('Error al eliminar cuenta:', error.message)
 * }
 */
export const deleteUserAccount = async (email, password, token) => {
    // Realizamos petición DELETE al endpoint de eliminación de cuenta
    const response = await fetch(`${API_URL}/api/users/account`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token para autenticación
        },
        body: JSON.stringify({ email, password }) // Credenciales para confirmación
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const errorData = await response.json()
        throw new errors.ServerError(errorData.message || 'Error al eliminar la cuenta')
    }
    
    // Retornamos la confirmación de eliminación
    return await response.json()
}