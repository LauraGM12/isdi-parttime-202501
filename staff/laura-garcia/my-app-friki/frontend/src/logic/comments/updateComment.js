import data from "../../data";
import { errors } from "common"
import getToken from "../helpers/getToken";

const updateComment = (postId, commentId, text) => {
    return fetch(`${import.meta.env.VITE_API_APP}/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${getToken()}`
        },
        body: JSON.stringify({ text })
    }).then(response => {
        if (response.status === 200) {
            return response.json().then(body => {
                return body.comment
            })
        } else {
            return response.json().then(body => {
                throw new Error(body.message)
            })
        }
    }).catch(error => {
        throw new Error(error)
    })
}

export default updateComment