import { getGamesByPlatform } from '../../../logic/games/getGamesByPlatform.js'
import { errors } from 'common'

const getGamesByPlatformHandler = (req, res) => {
    const { platformId } = req.params
    const { page = 1 } = req.query
    
    if (!platformId) {
        return res.status(400).json({ error: 'Se requiere el ID de la plataforma' })
    }
    
    getGamesByPlatform(platformId, parseInt(page))
        .then(gamesData => {
            res.json(gamesData)
        })
        .catch(error => {
            if (error instanceof errors.ValidationError) {
                res.status(400).json({ error: error.message })
            } else if (error instanceof errors.ServerError) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Error interno del servidor' })
            }
        })
}

export default getGamesByPlatformHandler