// Importamos las utilidades de validación y manejo de errores
import { validator, errors } from 'common'

/**
 * Registra un nuevo usuario en el sistema.
 * Esta función valida los datos del usuario, verifica la seguridad
 * de la contraseña y crea una nueva cuenta en el sistema.
 * 
 * @async
 * @function registerUser
 * @param {Object} registerData - Los datos de registro del usuario
 * @param {string} registerData.email - El email del nuevo usuario
 * @param {string} registerData.password - La contraseña del nuevo usuario
 * @param {string} registerData['confirmation-password'] - Confirmación de la contraseña
 * @param {string} registerData.username - El nombre de usuario único
 * @returns {Promise<Object>} Una promesa que resuelve con el resultado del registro
 * @throws {FormatError} Cuando la contraseña no cumple los requisitos de seguridad
 * @throws {ContentError} Cuando las contraseñas no coinciden
 * @throws {ValidationError} Cuando el email o contraseña no son válidos
 * @throws {DuplicityError} Cuando el email o username ya existen
 * @throws {ConnectionError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Registrar nuevo usuario
 * try {
 *   const resultado = await registerUser({
 *     email: 'nuevo@email.com',
 *     password: 'ContraseñaSegura123!',
 *     'confirmation-password': 'ContraseñaSegura123!',
 *     username: 'nuevoUsuario'
 *   })
 *   console.log('Usuario registrado:', resultado)
 * } catch (error) {
 *   console.error('Error en registro:', error.message)
 * }
 */
const registerUser = async (registerData) => {
    try {
        // Validamos la seguridad de la contraseña
        const securityErrors = validator.passwordSecurity(registerData['password'])

        // Si hay errores de seguridad, los reportamos
        if (securityErrors.length > 0) {
            throw new errors.FormatError(securityErrors.join(', '))
        }

        // Verificamos que las contraseñas coincidan
        if (registerData['password'] !== registerData['confirmation-password']) {
            throw new errors.ContentError('La contraseña y la confirmación de contraseña no coinciden')
        }

        // Validamos el formato del email
        validator.email(registerData['email'])
        // Validamos el formato de la contraseña
        validator.password(registerData['password'])
        // Validamos el formato de la confirmación de contraseña
        validator.password(registerData['confirmation-password'])

        // Preparamos los datos del usuario para el envío
        const user = { 
            email: registerData['email'], 
            password: registerData['password'],
            username: registerData['username']
        }

        // Realizamos petición POST al endpoint de registro
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        // Si el registro es exitoso (status 201)
        if (response.status === 201) {
            return { success: true } // Retornamos confirmación de éxito
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de formato, contenido o duplicidad, lo propagamos
        if (error instanceof errors.FormatError || 
            error instanceof errors.ContentError || 
            error instanceof errors.DuplicityError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error de conexión
        throw new errors.ConnectionError(error.message)
    }
}

export default registerUser