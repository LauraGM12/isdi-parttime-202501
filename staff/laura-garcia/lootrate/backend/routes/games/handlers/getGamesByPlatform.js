import { getGamesByPlatform } from '../../../logic/games/getGamesByPlatform.js'
import { errors } from 'common'

// Handler para obtener juegos por plataforma
const getGamesByPlatformHandler = (req, res) => {
    // Obtenemos el ID de la plataforma desde los parámetros de la URL
    const { platformId } = req.params
    const { page = 1 } = req.query
    
    // Validamos que se proporcione la plataforma
    if (!platformId) {
        return res.status(400).json({ error: 'Se requiere el ID de la plataforma' })
    }
    
    // Ejecutamos la lógica para obtener juegos por plataforma
    getGamesByPlatform(platformId, parseInt(page))
        .then(gamesData => {
            // Si todo va bien, retornamos los datos
            res.json(gamesData)
        })
        .catch(error => {
            // Manejo de errores específicos
            if (error instanceof errors.ValidationError) {
                res.status(400).json({ error: error.message })
            } else if (error instanceof errors.ServerError) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Error interno del servidor' })
            }
        })
}

// Exportamos el handler
export default getGamesByPlatformHandler