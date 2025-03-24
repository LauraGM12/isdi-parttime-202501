//traernos imports necesarios:

import data from './data.mjs'
import navigate from './navigate.mjs'
import validator from './validators.mjs'

/*Logicas internas de las funcionalidades de la app*/

const loginUser = (loginData) => { //{'email': 'patata@mail.com'}
    //comprobamos si el email que ha puesto el usuario esta en la bbdd y si no lo esta, lanzamos un alert

    const userLoginCheckout = data.findUserByEmail(loginData['email'])

    //comprueba que el usuario loggeado esta en nuestra ddbb(si es que tenemos una base de datos)
    //si esta en la base de datos, comprobamos que la cotnraseña coincide con la del usuario, sino, lanzamos un alert
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

    //y si se cumple todo, guardamos el id en el session storage y navegamos a home*/

}

const registerUser = (registerData) => { //registerData = {'email': '', 'password': '', 'confirmation-password': ''}
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


    /*Podriamos longitud, y caracteres de la contraseñar, validar que el mail no esta en uso, etc*/

    //comprobar si el user ya existe

    const doesUserExist = data.findUserByEmail(registerData['email'])
    if (doesUserExist) {
        alert('Something went wrong, try again with new credentials')
        return
    }

    const userCreated = { email: registerData['email'], password: registerData['password'], username, id: Date.now() }

    data.createUser(userCreated)

    sessionStorage.id = userCreated.id //almacenamos en el sessionStorage el id del usuario que se acaba de registrar y loggear

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
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); //comprobar si se ha guardado el id de un usuario loggeado
    }

    const posts = data.retrievePosts();

    if (posts.length > 0) posts.sort((item1, item2) => new Date(item2.createdOn) - new Date(item1.createdOn))

    for (let i = 0; i < posts.length; i++) {
        const author = data.findUserById(posts[i].author)
        if (author) { // Check if author is not undefined
            posts[i].author = author.username
        }
        const date = new Date(posts[i].createdOn)
        posts[i].createdOn = date.toLocaleString()
        if (!posts[i].likes) posts[i].likes = []; //para manejar posts sin arrays de likes
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
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); //comprobar si se ha guardado el id de un usuario loggeado
    }

    const userLogged = data.findUserById(loggedUserId)

    return userLogged.username
}

const toggleLike = (postId) => {
    let loggedUserId;
    if (localStorage.id) {
        loggedUserId = JSON.parse(localStorage.getItem('id'));
    } else {
        loggedUserId = JSON.parse(sessionStorage.getItem('id')); //comprobar si se ha guardado el id de un usuario loggeado
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