import { validator } from "common"
import logic from "../../../logic/index.js"
import * as jose from 'jose'
import 'dotenv/config'

// Handler para el endpoint de login de usuarios
// Valida credenciales y genera token JWT encriptado
const loginUser = (req, res, next) => {
    const { email, password } = req.body
    
    try {
        // Validar formato del email
        validator.email(email)
        // Validar formato de la contraseña
        validator.password(password)
        
        // Llamar a la lógica de login
        return logic.loginUser(email, password)
            .then((id) => {
                // Decodificar el secreto JWT desde las variables de entorno
                const secret = jose.base64url.decode(process.env.JWT_SECRET)

                // Crear y encriptar el token JWT con el ID del usuario
                return new jose.EncryptJWT({ id })
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' }) // Algoritmo de encriptación
                    .setIssuedAt() // Establecer fecha de emisión
                    .encrypt(secret) // Encriptar con el secreto
                    .then(token => res.status(200).send({ token })) // Enviar token al cliente
            })
            .catch((error) => next(error)) // Pasar errores al middleware
    } catch (error) {
        // Pasar errores de validación al middleware
        next(error)
    }
}

export default loginUser