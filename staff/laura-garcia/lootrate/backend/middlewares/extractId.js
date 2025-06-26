import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { TokenError } from '../../common/errors.js'

// Middleware para extraer y validar el ID del usuario desde el token JWT
const extractId = (req, res, next) => {
    const authHeader = req.headers.authorization

    // Verificar que existe el header de autorización
    if (!authHeader) {
        return next(new TokenError('falta el header de autorización'))
    }

    // Extraer el token del header (formato: "Bearer <token>")
    const token = authHeader.split(" ")[1]
    
    if (!token) {
        return next(new TokenError('falta el token'))
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        })
        
        // Añadir el ID del usuario al request
        req.userId = decoded.id
        next()
        
    } catch (error) {
        // Manejo de diferentes tipos de errores de token
        if (error.name === 'TokenExpiredError') {
            next(new TokenError('token expirado'))
        } else if (error.name === 'JsonWebTokenError') {
            next(new TokenError('token inválido'))
        } else {
            next(new TokenError('falló la verificación del token'))
        }
    }
}

export default extractId