import { errors } from 'common'
import changePassword from '../../../logic/users/changePassword.js'

const { SystemError, ExistenceError, AuthError } = errors

export default async (req, res) => {
    try {
        const { userId } = req
        const { currentPassword, newPassword } = req.body
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'ValidationError', 
                message: 'Se requieren la contraseña actual y la nueva contraseña' 
            })
        }
        
        if (currentPassword === newPassword) {
            return res.status(400).json({ 
                error: 'ValidationError', 
                message: 'La nueva contraseña debe ser diferente a la actual' 
            })
        }
        
        const result = await changePassword(userId, currentPassword, newPassword)
        
        res.status(200).json(result)
    } catch (error) {
        let status = 500  
        
        if (error instanceof ExistenceError || 
            error instanceof AuthError) {
            status = 400
        }
        
        res.status(status).json({ 
            error: error.constructor.name, 
            message: error.message 
        })
    }
}