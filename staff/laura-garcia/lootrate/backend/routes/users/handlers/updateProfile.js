import { errors } from 'common'
import updateProfile from '../../../logic/users/updateProfile.js'

const updateProfileHandler = async (req, res, next) => {
    try {
        const { userId } = req
        const profileData = req.body
        const updatedProfile = await updateProfile(userId, profileData)

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: updatedProfile
        })
    } catch (error) {
        next(error)
    }
}

export default updateProfileHandler