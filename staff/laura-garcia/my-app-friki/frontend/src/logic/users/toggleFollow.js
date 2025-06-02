import { errors, validator } from "common"
import getToken from "../helpers/getToken";

const toggleFollow = (userId) => {
    validator.id(userId)

    return fetch(`${import.meta.env.VITE_API_APP}/users/follow/${userId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Basic ${getToken()}`
        }
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) return
            else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })

}

export default toggleFollow