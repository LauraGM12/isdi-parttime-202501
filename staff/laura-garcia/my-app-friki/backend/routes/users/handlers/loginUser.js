import { validator } from "common"
import logic from "../../../logic/index.js"
import * as jose from 'jose'
import 'dotenv/config'

const loginUser = (req, res, next) => {
    const { email, password } = req.body
    try {
        validator.email(email)
        validator.password(password)
        return logic.loginUser(email, password)
            .then((id) => {
                const secret = jose.base64url.decode(process.env.JWT_SECRET)

                return new jose.EncryptJWT({ id })
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                    .setIssuedAt()
                    .encrypt(secret)
                    .then(token => res.status(200).send({ token }))
            })
            .catch((error) => next(error))
    } catch (error) {
        next(error)
    }
}

export default loginUser


/*
import crypto from 'crypto'

console.log(crypto.randomBytes(32).toString('base64url'))
*/