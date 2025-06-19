// Importamos la lógica y common
import { getHomeData } from '../../../logic/games/getHomeData.js'
import { errors } from 'common'

// Handler para obtener datos del home
const getHomeDataHandler = (req, res) => {
    // Ejecutamos la lógica de obtener datos del home
    getHomeData()
        .then(homeData => {
            // Si todo va bien, retornamos los datos
            res.json(homeData)
        })
        .catch(error => {
            // Manejo de errores específicos
            if (error instanceof errors.ServerError) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Error interno del servidor' })
            }
        })
}

// Exportamos el handler
export default getHomeDataHandler