import 'dotenv/config'
import { errors } from "../../common/index.js"

const { FormatError, ExistenceError, AuthError, DuplicityError, ContentError, TokenError } = errors

export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Ruta ${req.originalUrl} no encontrada`)
    error.status = 404
    next(error)
}

export const errorHandler = (error, req, res, next) => {
    const response = {}

    if (process.env.IS_DEBUG_MODE === 'true')

    if (error instanceof TypeError || error instanceof RangeError || error instanceof FormatError || error instanceof ContentError) {
        response.name = error.name
        response.message = error.message
        res.status(400).send(JSON.stringify(response))
    } 
    else if (error instanceof AuthError || error instanceof TokenError) {
        response.name = error.name
        response.message = error.message
        res.status(401).send(JSON.stringify(response))
    } 
    else if (error instanceof ExistenceError) {
        response.name = error.name
        response.message = error.message
        res.status(404).send(JSON.stringify(response))
    } 
    else if (error instanceof DuplicityError) {
        response.name = error.name
        response.message = error.message
        res.status(409).send(JSON.stringify(response))
    } 
    else {
        response.name = 'ServerError'
        response.message = error.message
        res.status(500).send(JSON.stringify(response))
    }
}
