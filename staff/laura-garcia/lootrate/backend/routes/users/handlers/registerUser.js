import { validator, errors } from "common"
import { registerUser as registerUserLogic } from '../../../logic/users/index.js'

/**
 * Handler para el registro de nuevos usuarios
 * 
 * Este endpoint permite crear una nueva cuenta de usuario en el sistema
 * validando los datos de entrada y creando el perfil inicial.
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Email del nuevo usuario (debe ser único)
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.username - Nombre de usuario (debe ser único)
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {Object} Respuesta JSON confirmando el registro exitoso
 * 
 * @throws {ValidationError} Si algún campo no cumple el formato requerido
 * @throws {DuplicityError} Si el email o username ya están en uso
 * @throws {SystemError} Si ocurre un error interno del servidor
 */
const registerUser = (req, res, next) => {
    // Extraer los datos del nuevo usuario del cuerpo de la solicitud
    const { email, password, username } = req.body
    
    try {
        // Validar formato del email (debe ser un email válido)
        validator.email(email)
        
        // Validar formato de la contraseña (longitud, complejidad, etc.)
        validator.password(password)
        
        // Llamar a la lógica de negocio para crear el nuevo usuario
        return registerUserLogic(email, password, username)
            .then(() => {
                // Responder con éxito (201 Created) confirmando el registro
                res.status(201).json({ 
                    success: true, 
                    message: 'Usuario registrado exitosamente' 
                })
            })
            .catch((error) => next(error)) // Pasar errores al middleware de manejo de errores
    } catch (error) {
        // Manejar errores de validación y pasarlos al middleware de errores
        next(error)
    }
}

export default registerUser