import { errors } from "common"
import * as jose from 'jose'
import 'dotenv/config'

// Middleware para extraer y validar el ID del usuario desde el token JWT
const extractId = (req, res, next) => {
    const authHeader = req.headers.authorization

    // Verificar que existe el header de autorización
    if (!authHeader) {
        return next(new errors.TokenError('authorization header missing'))
    }

    // Extraer el token del header (formato: "Bearer <token>")
    const token = authHeader.split(" ")[1]
    
    if (!token) {
        return next(new errors.TokenError('token missing'))
    }

    // Decodificar el secreto JWT
    const secret = jose.base64url.decode(process.env.JWT_SECRET)

    // Desencriptar y validar el token
    return jose.jwtDecrypt(token, secret)
        .catch(error => next(new errors.TokenError('invalid token')))
        .then((result) => {
            const now = new Date()
            const nowTime = now.getTime() / 1000
            const tokenTime = result.payload.iat + (process.env.JWT_MINUTES_TIMEOUT * 60)

            // Verificar si el token ha expirado
            if (nowTime > tokenTime) {
                next(new errors.TokenError('expired token'))
            } else {
                // Añadir el ID del usuario al request
                req.userId = result.payload.id
                next()
            }
        })
}

export default extractId