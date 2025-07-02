import { searchGames } from '../../../logic/games/searchGames.js'
import { errors } from 'common'

const searchGamesHandler = (req, res) => {
    const { q: query, page = 1 } = req.query
    
    if (!query) {
        return res.status(400).json({ error: 'Se requiere una consulta de búsqueda' })
    }

    searchGames(query, parseInt(page))
        .then(searchResults => {
            res.json(searchResults)
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

export default searchGamesHandler