import { getGamesByGenre } from '../../../logic/games/getGamesByGenre.js'
import { errors } from 'common'

// Handler para obtener juegos por género
const getGamesByGenreHandler = (req, res) => {
    // Obtenemos el slug del género desde los parámetros de la URL
    const { genreSlug } = req.params
    const { page = 1 } = req.query
    
    // Validamos que se proporcione el género
    if (!genreSlug) {
        return res.status(400).json({ error: 'Se requiere el slug del género' })
    }
    
    // Ejecutamos la lógica para obtener juegos por género
    getGamesByGenre(genreSlug, parseInt(page))
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
export default getGamesByGenreHandler