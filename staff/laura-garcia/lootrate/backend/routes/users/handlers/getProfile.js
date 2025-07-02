import getProfile from '../../../logic/users/getProfile.js'
import { data } from '../../../data/index.js'

const getProfileHandler = async (req, res, next) => {
    try {
        let targetUserId

        if (req.route.path === '/profile/own') {
            targetUserId = req.userId
        } 
        else if (req.params.username) {
            const user = await data.users.findOne({ username: req.params.username }).select('_id')

            if (!user) {
                return res.status(404).json({
                    success: false,
                    name: 'ExistenceError',
                    message: 'usuario no encontrado'
                })
            }

            targetUserId = user._id
        }

        const profile = await getProfile(targetUserId)

        res.status(200).json({
            success: true,
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

export default getProfileHandler