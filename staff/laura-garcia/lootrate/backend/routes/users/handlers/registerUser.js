import { validator, errors } from "common"
import { registerUser as registerUserLogic } from '../../../logic/users/index.js'

const registerUser = (req, res, next) => {
    const { email, password, username } = req.body
    
    try {
        validator.email(email)
        validator.password(password)

        return registerUserLogic(email, password, username)
            .then(() => {
                res.status(201).json({ 
                    success: true, 
                    message: 'Usuario registrado exitosamente' 
                })
            })
            .catch((error) => next(error)) 
    } catch (error) {
        next(error)
    }
}

export default registerUser