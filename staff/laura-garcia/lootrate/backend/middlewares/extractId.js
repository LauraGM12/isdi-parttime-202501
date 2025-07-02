import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { TokenError } from '../../common/errors.js'

const extractId = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return next(new TokenError('falta el header de autorización'))
    }

    const token = authHeader.split(" ")[1]
    
    if (!token) {
        return next(new TokenError('falta el token'))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        })
        
        req.userId = decoded.id
        next()
        
    } catch (error) {
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