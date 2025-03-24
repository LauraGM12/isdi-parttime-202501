const data = {
    findUserById: (id) => { //definimos la función para poder acceder a ella
        const usersJson = localStorage.users //nos traemos los users de la bbdd del localStorage
        if (!usersJson) return undefined //si no hay bbdd devolvemos undefined porque no hay ningun usuario

        const users = JSON.parse(usersJson) //si sí hay bbdd la convertimos a js

        const userFound = users.find(user => user.id === id) //buscamos el usuario con el mismo id usando el metodo find

        return userFound //lo devolvemos
    },
    findUserByEmail: (email) => {
        const usersJson = localStorage.users
        if (!usersJson) return undefined

        const users = JSON.parse(usersJson)

        const userFound = users.find(user => user.email === email)

        return userFound
    },
    createUser: (user) => { //e.g user = {email: "percy1@mail.com", password: "percy1@mail.com", username: "percy1", id: 1740600285989}
        const usersJson = localStorage.users
        let users;
        if (!usersJson) {
            users = []
        } else {
            users = JSON.parse(usersJson)
        }

        users.push(user)

        localStorage.setItem('users', JSON.stringify(users))
    },
    createPost: (post) => { //e.g post = {title: "Hello", description: "world", img: "https://iamalink.com/img.png"}
        const postsJson = localStorage.posts
        let posts;
        if (!postsJson) {
            posts = [];
        } else {
            posts = JSON.parse(postsJson)
        }

        post.createdOn = new Date();
        post.id = Date.now()
        post.likes = []

        posts.push(post)

        localStorage.posts = JSON.stringify(posts)

    },
    retrievePosts: () => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : [];

        return posts
    },
    updatePostById: (id, newPostData) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : [];
        const postIndex = posts.findIndex(post => post.id === id)
        if (postIndex === -1) {
            return
        }

        posts[postIndex] = newPostData

        localStorage.posts = JSON.stringify(posts)
    },
    findPostById: (id) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : [];
        const post = posts.find(post => post.id === id)
        return post
    }
}

export default data