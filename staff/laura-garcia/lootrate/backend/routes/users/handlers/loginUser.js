import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { validator, errors } from "common"
import { loginUser as loginUserLogic } from '../../../logic/users/index.js'

const loginUser = (req, res, next) => {
    const { email, password } = req.body
    
    try {
        validator.email(email)
        validator.password(password)

        return loginUserLogic(email, password)
            .then((id) => {
                const payload = { 
                    id,
                    iat: Math.floor(Date.now() / 1000) 
                }

                const token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' } 
                )

                res.status(200).json({ token })
            })
            .catch((error) => next(error)) 
    } catch (error) {
        next(error)
    }
}

export default loginUser