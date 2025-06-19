// Handler para buscar juegos
import { searchGames } from '../../../logic/games/searchGames.js'
import { errors } from 'common'

// Handler para buscar juegos
const searchGamesHandler = (req, res) => {
    // Obtenemos los parámetros de búsqueda
    const { q: query, page = 1 } = req.query
    
    // Validamos que se proporcione una query
    if (!query) {
        return res.status(400).json({ error: 'Se requiere una consulta de búsqueda' })
    }
    
    // Ejecutamos la lógica de búsqueda
    searchGames(query, parseInt(page))
        .then(searchResults => {
            // Si todo va bien, retornamos los resultados
            res.json(searchResults)
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
export default searchGamesHandler