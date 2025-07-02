import { getGamesByGenre } from '../../../logic/games/getGamesByGenre.js'
import { errors } from 'common'

const getGamesByGenreHandler = (req, res) => {
    const { genreSlug } = req.params
    const { page = 1 } = req.query
    
    if (!genreSlug) {
        return res.status(400).json({ error: 'Se requiere el slug del género' })
    }
    
    getGamesByGenre(genreSlug, parseInt(page))
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

export default getGamesByGenreHandler