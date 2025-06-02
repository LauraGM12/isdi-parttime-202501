import data from "../../data"
import { errors, validator } from "common"
import getToken from "../helpers/getToken";


const updateUsername = (newUsername) => {
    validator.username(newUsername)

    return fetch(`${import.meta.env.VITE_API_APP}/users/username`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${getToken()}`
        },
        body: JSON.stringify({ username: newUsername })
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

export default updateUsername