import { errors, validator } from "common"
import getToken from "../helpers/getToken"

const deleteUser = (password) => {
    validator.password(password)

    return fetch(`${import.meta.env.VITE_API_APP}/users`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${getToken()}`
        },
        body: JSON.stringify({ password })
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

export default deleteUser
