const data = {
    findUserById: (id) => { 
        const usersJson = localStorage.users 
        if (!usersJson) return undefined 

        const users = JSON.parse(usersJson) 

        const userFound = users.find(user => user.id === id)

        return userFound 
    },
    findUserByEmail: (email) => {
        const usersJson = localStorage.users
        if (!usersJson) return undefined

        const users = JSON.parse(usersJson)

        const userFound = users.find(user => user.email === email)

        return userFound
    },
    createUser: (user) => { 
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
    createPost: (post) => { 
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