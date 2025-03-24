import data from './data.mjs'
import navigate from './navigate.mjs'
import validator from './validators.mjs'

const loginUser = (loginData) => { 

    const userLoginCheckout = data.findUserByEmail(loginData['email'])

    if (!userLoginCheckout || userLoginCheckout['password'] !== loginData['password']) {
        alert("wrong credentials")
        return
    }

    if (loginData['remember']) {
        localStorage.id = userLoginCheckout.id
    } else {
        sessionStorage.id = userLoginCheckout.id
    }

    navigate('login', 'home')
}

const registerUser = (registerData) => { 
    if (!registerData['email'] || !registerData['password'] || !registerData['confirmation-password']) {
        alert('Register Data Incomplete')
        return;
    }
    
    if (registerData['password'] !== registerData['confirmation-password']) {
        alert('Password and confirmation password are not the same')
        return
    }

    validator.email(registerData['email'])
    validator.password(registerData['password'])
    const username = registerData['email'].split('@')[0]
    validator.username(username)


    const doesUserExist = data.findUserByEmail(registerData['email'])
    if (doesUserExist) {
        alert('Something went wrong, try again with new credentials')
        return
    }

    const userCreated = { email: registerData['email'], password: registerData['password'], username, id: Date.now() }

    data.createUser(userCreated)

    sessionStorage.id = userCreated.id 

    navigate('register', 'home')
}


const publishPost = (postData) => {
    validator.text(postData['title'], 40, 1, 'Post-Title')
    validator.text(postData['description'], 210, 1, 'Post-Description')
    if (postData['img']) validator.imgUrl(postData['img'])

    let userIdJson = localStorage.id;
    if (!userIdJson) {
        userIdJson = sessionStorage.id
    }

    const userId = JSON.parse(userIdJson)
    validator.id(userId)

    postData.author = userId;
    data.createPost(postData)
}

const getAllPosts = () => {
    let loggedUserId;
    if (localStorage.id) {
        loggedUserId = JSON.parse(localStorage.getItem('id'));
    } else {
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); 
    }

    const posts = data.retrievePosts();

    if (posts.length > 0) posts.sort((item1, item2) => new Date(item2.createdOn) - new Date(item1.createdOn))

    for (let i = 0; i < posts.length; i++) {
        const author = data.findUserById(posts[i].author)
        if (author) { 
            posts[i].author = author.username
        }
        const date = new Date(posts[i].createdOn)
        posts[i].createdOn = date.toLocaleString()
        if (!posts[i].likes) posts[i].likes = []; 
        if (posts[i].likes.length > 0 && posts[i].likes.includes(loggedUserId)) {
            posts[i].isLiked = true
        } else {
            posts[i].isLiked = false
        }
    }

    return posts
}

const getLoggedUserUsername = () => {
    let loggedUserId;
    if (localStorage.id) {
        loggedUserId = JSON.parse(localStorage.getItem('id'));
    } else {
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); 
    }

    const userLogged = data.findUserById(loggedUserId)

    return userLogged.username
}

const toggleLike = (postId) => {
    let loggedUserId;
    if (localStorage.id) {
        loggedUserId = JSON.parse(localStorage.getItem('id'));
    } else {
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); 
    }

    const post = data.findPostById(postId)

    if (!post.likes) post.likes = [];

    const userIndex = post.likes.indexOf(loggedUserId)

    if (userIndex !== -1) {
        post.likes.splice(userIndex, 1);
    } else {
        post.likes.push(loggedUserId)
    }

    data.updatePostById(postId, post)

}

export {
    loginUser,
    registerUser,
    publishPost,
    getAllPosts,
    getLoggedUserUsername,
    toggleLike
}