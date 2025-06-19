// Importamos las clases de error y validador desde el módulo común
import { validator, errors } from 'common'

/**
 * Autentica a un usuario en el sistema utilizando email y contraseña.
 * Esta función valida las credenciales y retorna un token JWT
 * para mantener la sesión del usuario autenticado.
 * 
 * @async
 * @function loginUser
 * @param {Object} loginData - Los datos de inicio de sesión
 * @param {string} loginData.email - El email del usuario
 * @param {string} loginData.password - La contraseña del usuario
 * @returns {Promise<Object>} Una promesa que resuelve con el token de autenticación
 * @throws {ValidationError} Cuando el email o contraseña no son válidos
 * @throws {AuthError} Cuando las credenciales son incorrectas
 * @throws {ConnectionError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Iniciar sesión de usuario
 * try {
 *   const resultado = await loginUser({
 *     email: 'usuario@email.com',
 *     password: 'miContraseña123'
 *   })
 *   console.log('Token obtenido:', resultado.token)
 * } catch (error) {
 *   console.error('Error de autenticación:', error.message)
 * }
 */
const loginUser = async (loginData) => {
    // Validamos el formato del email
    validator.email(loginData['email'])
    // Validamos el formato de la contraseña
    validator.password(loginData['password'])

    // Preparamos las credenciales para el envío
    const credentials = {
        email: loginData['email'], 
        password: loginData['password'] 
    }

    try {
        // Realizamos petición POST al endpoint de autenticación
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })

        // Si la autenticación es exitosa (status 200)
        if (response.status === 200) {
            const body = await response.json()
            return { token: body.token } // Retornamos el token JWT
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de validación o autenticación, lo propagamos
        if (error instanceof errors.ValidationError || error instanceof errors.AuthError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error de conexión
        throw new errors.ConnectionError(error.message)
    }
}

export default loginUser