import data from "../../data";
import { errors } from "common"
import getToken from "../helpers/getToken";

const deleteComment = (postId, commentId) => {
    return fetch(`${import.meta.env.VITE_API_APP}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${getToken()}`
        }
    }).then(response => {
        if (response.status === 204) {
            return true
        } else {
            return response.json().then(body => {
                throw new Error(body.message)
            })
        }
    }).catch(error => {
        throw new Error(error)
    })
}

export default deleteComment