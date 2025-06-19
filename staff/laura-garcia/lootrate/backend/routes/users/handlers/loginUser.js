import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { validator, errors } from "common"
import { loginUser as loginUserLogic } from '../../../logic/users/index.js'

/**
 * Handler para el inicio de sesión de usuarios
 * 
 * Este endpoint autentica a un usuario mediante email y contraseña,
 * y devuelve un token JWT válido para futuras peticiones autenticadas.
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {Object} Respuesta JSON con el token JWT
 * 
 * @throws {ValidationError} Si el email o contraseña no cumplen el formato requerido
 * @throws {ExistenceError} Si el usuario no existe
 * @throws {AuthError} Si la contraseña es incorrecta
 * @throws {SystemError} Si ocurre un error interno del servidor
 */
const loginUser = (req, res, next) => {
    // Extraer credenciales del cuerpo de la solicitud
    const { email, password } = req.body
    
    try {
        // Validar formato del email
        validator.email(email)
        
        // Validar formato de la contraseña
        validator.password(password)
        
        // Llamar a la lógica de negocio para autenticar al usuario
        return loginUserLogic(email, password)
            .then((id) => {
                // Crear payload para el token JWT con información mínima necesaria
                const payload = { 
                    id, // ID del usuario autenticado
                    iat: Math.floor(Date.now() / 1000) // Timestamp de emisión del token
                }
                
                // Generar token JWT firmado con la clave secreta
                const token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET, // Clave secreta desde variables de entorno
                    { expiresIn: '1h' } // Token válido por 1 hora
                )
                
                // Responder con éxito (200 OK) y el token generado
                res.status(200).json({ token })
            })
            .catch((error) => next(error)) // Pasar errores al middleware de manejo de errores
    } catch (error) {
        // Manejar errores de validación y pasarlos al middleware de errores
        next(error)
    }
}

export default loginUser