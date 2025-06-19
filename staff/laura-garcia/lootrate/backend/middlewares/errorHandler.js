import { errors } from 'common'
import 'dotenv/config'

// Destructuring de los tipos de error personalizados
const { FormatError, ExistenceError, AuthError, DuplicityError, ContentError, TokenError } = errors

// Middleware para rutas no encontradas (404)
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Ruta ${req.originalUrl} no encontrada`)
    error.status = 404
    next(error)
}

// Middleware para manejo centralizado de errores
export const errorHandler = (error, req, res, next) => {
    const response = {}

    // Mostrar error en consola si está en modo debug
    if (process.env.IS_DEBUG_MODE === 'true') console.error(error)

    // Errores de validación y formato (400 Solicitud Incorrecta)
    if (error instanceof TypeError || error instanceof RangeError || error instanceof FormatError || error instanceof ContentError) {
        response.name = error.name
        response.message = error.message
        res.status(400).send(JSON.stringify(response))
    } 
    // Errores de autenticación y token (401 No Autorizado)
    else if (error instanceof AuthError || error instanceof TokenError) {
        response.name = error.name
        response.message = error.message
        res.status(401).send(JSON.stringify(response))
    } 
    // Errores de existencia/no encontrado (404 No Encontrado)
    else if (error instanceof ExistenceError) {
        response.name = error.name
        response.message = error.message
        res.status(404).send(JSON.stringify(response))
    } 
    // Errores de duplicidad (409 Conflicto)
    else if (error instanceof DuplicityError) {
        response.name = error.name
        response.message = error.message
        res.status(409).send(JSON.stringify(response))
    } 
    // Errores del servidor (500 Error Interno del Servidor)
    else {
        response.name = 'ServerError'
        response.message = error.message
        res.status(500).send(JSON.stringify(response))
    }
}
