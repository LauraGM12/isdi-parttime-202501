import { validator } from "common"
import logic from "../../../logic/index.js"

// Handler para el endpoint de registro de usuarios
// Valida los datos de entrada y llama a la lógica de negocio
const registerUser = (req, res, next) => {
    const { email, password } = req.body

    try {
        // Validar formato del email
        validator.email(email)
        // Validar formato de la contraseña
        validator.password(password)

        // Generar username a partir del email (parte antes del @)
        const username = email.split('@')[0]
        // Validar el username generado
        validator.username(username)

        // Llamar a la lógica de registro y manejar la respuesta
        return logic.registerUser(email, password, username)
            .then(() => res.status(201).send()) // Enviar respuesta exitosa sin contenido
            .catch(error => next(error)) // Pasar errores al middleware de manejo de errores

    } catch (error) {
        // Pasar errores de validación al middleware de manejo de errores
        next(error)
    }
}

export default registerUser