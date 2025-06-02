import { errors } from "common"
import { data } from "../../data/index.js"

const getPostsByAuthor = (userId, authorId) => {
    return data.users.findOne({ _id: new data.ObjectId(userId) })
        .catch((error) => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            return data.posts.aggregate([
                {
                    $match: {
                        author: new data.ObjectId(authorId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $unwind: "$author"
                },
                {
                    $addFields: {
                        "id": "$_id",
                        "author.id": "$author._id"
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $project: {
                        "_id": 0,
                        "author.password": 0,
                        "author.email": 0,
                        "author._id": 0
                    }
                }
            ]).toArray()
                .catch((error) => { throw new errors.ServerError(error.message) })
                .then(posts => {

                    const formatedPosts = posts.map((post) => {
                        const date = new Date(post.createdOn)
                        post.createdOn = date.toLocaleString()
                        if (post.likes.length > 0 && post.likes.includes(userId)) {
                            post.isLiked = true
                        } else {
                            post.isLiked = false
                        }
                        return post
                    })
                    return formatedPosts
                })
        })
}

export default getPostsByAuthor