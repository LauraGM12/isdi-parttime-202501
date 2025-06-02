import { errors, validator } from "common"
import getToken from "../helpers/getToken";

const getUserUsername = (userId) => {
    if (userId) validator.id(userId)

    return fetch(`${import.meta.env.VITE_API_APP}/users/username/${userId ? userId : 'logged'}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${getToken()}`
        }
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) {
                return response.json().then(body => {
                    return body.username
                })
            } else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })
}

export default getUserUsername