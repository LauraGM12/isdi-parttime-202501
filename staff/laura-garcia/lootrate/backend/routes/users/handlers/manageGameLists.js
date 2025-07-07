import { addToGameList, removeFromGameList, getGameList } from '../../../logic/users/index.js'

const addToListHandler = async (req, res, next) => {
    try {
        const { userId } = req
        const { gameData, listType } = req.body
        const result = await addToGameList(userId, gameData, listType)
        
        res.status(200).json({
            success: true,
            message: result.message || `Juego agregado a ${listType}`,
            action: result.action || 'added', 
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const removeFromListHandler = async (req, res, next) => {
    try {
        const { userId } = req
        const { listType, gameId } = req.body
        const result = await removeFromGameList(userId, gameId, listType)
        
        res.status(200).json({
            success: true,
            message: `Juego eliminado de ${listType}`,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getGameListHandler = async (req, res, next) => {
    try {
        const { listType } = req.params
        
        if (req.route.path.includes('/own/')) {
            const { userId } = req
            const gameList = await getGameList(userId, listType, false)
            res.status(200).json(gameList)
        } else {
            const { username } = req.params
            const gameList = await getGameList(username, listType, true) 
            res.status(200).json(gameList)
        }
    } catch (error) {
        next(error)
    }
}

export { addToListHandler, removeFromListHandler, getGameListHandler }