import { getHomeData } from '../../../logic/games/getHomeData.js'
import { errors } from 'common'

const getHomeDataHandler = (req, res) => {
    getHomeData()
        .then(homeData => {
            res.json(homeData)
        })
        .catch(error => {
            if (error instanceof errors.ServerError) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Error interno del servidor' })
            }
        })
}

export default getHomeDataHandler