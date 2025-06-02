import { validator } from "common"
import getToken from "../helpers/getToken";

const getUserIdByUsername = (username) => {
    validator.username(username)

    return fetch(`${import.meta.env.VITE_API_APP}/users/id/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${getToken()}`
        }
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) {
                return response.json().then(body => {
                    return body.id
                })
            } else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })
}

export default getUserIdByUsername