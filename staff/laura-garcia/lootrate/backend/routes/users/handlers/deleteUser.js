import { errors } from "common"
import deleteUser from '../../../logic/users/deleteUser.js'

const { SystemError, ExistenceError, AuthError } = errors

export default async (req, res) => {
    try {
        const { userId } = req
        const { email, password } = req.body
        const result = await deleteUser(userId, email, password)
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