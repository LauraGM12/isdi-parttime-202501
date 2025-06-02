import { errors, validator } from "common"
import getToken from "../helpers/getToken"

const updatePassword = (newPassword, confirmationNewPassword, oldPassword) => {
    validator.password(newPassword)
    validator.password(confirmationNewPassword)
    validator.password(oldPassword)

    if (newPassword !== confirmationNewPassword) {
        throw new errors.ContentError('password and confirmation password are not the same')
    }

    return fetch(`${import.meta.env.VITE_API_APP}/users/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${getToken()}`
        },
        body: JSON.stringify({ 'new-password': newPassword, 'old-password': oldPassword })
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) {
                return
            } else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })
}

export default updatePassword