const posts = {
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
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : []

        return posts
    },
    retrievePostsByAuthorId: (id) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : []

        const filteredPosts = posts.filter(post => post.author === id)

        return filteredPosts
    },
    updatePostById: (id, newPostData) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : []
        const postIndex = posts.findIndex(post => post.id === id)
        if (postIndex === -1) {
            return
        }

        posts[postIndex] = newPostData

        localStorage.posts = JSON.stringify(posts)
    },
    findPostById: (id) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : []
        const post = posts.find(post => post.id === id)
        return post
    },
    deletePostById: (id) => {
        const posts = localStorage.posts ? JSON.parse(localStorage.getItem("posts")) : []
        const postIndex = posts.findIndex(post => post.id === id)
        if (postIndex === -1) {
            return
        }

        posts.splice(postIndex, 1)

        localStorage.posts = JSON.stringify(posts)
    }
}

export default posts