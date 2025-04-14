import data from "../../data";
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId";

const publishPost = (title, description, img) => {
    validator.text(title, 40, 1, 'Post-Title')
    validator.text(description, 210, 1, 'Post-Description')
    //if (postData['img']) validator.imgUrl(postData['img'])

    const postData = { title, description }

    if (img) postData.img = img

    const userId = getLoggedUserId()

    validator.id(userId)

    postData.author = userId;
    data.posts.createPost(postData)
}

export default publishPost