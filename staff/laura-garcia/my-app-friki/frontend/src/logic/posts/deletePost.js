import { errors, validator } from "common"
import getToken from "../helpers/getToken";

const deletePost = (postId) => {
    validator.id(postId)
    return fetch(`${import.meta.env.VITE_API_APP}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) return
            else {
                response.json().then(body => {
                    throw new Error(body.message)
                })
            }
        })

}

export default deletePost