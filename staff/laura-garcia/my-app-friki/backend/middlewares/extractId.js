import * as jose from 'jose'
import 'dotenv/config'
import { errors } from 'common'

const extractId = (req, res, next) => {
    const auhtHeader = req.headers.authorization

    const token = auhtHeader.split(" ")[1]

    const secret = jose.base64url.decode(process.env.JWT_SECRET)

    return jose.jwtDecrypt(token, secret)
        .catch(error => next(error))
        .then((result) => {
            const now = new Date()

            const nowTime = now.getTime() / 1000
            const tokenTime = result.payload.iat + (process.env.JWT_MINUTES_TIMEOUT * 60)

            if (nowTime > tokenTime) next(new errors.TokenError('expired token'))
            else {
                req.userId = result.payload.id
                next()
            }
        })
}

export default extractId