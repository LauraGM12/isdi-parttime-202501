import { MongoClient, ObjectId } from "mongodb"
import 'dotenv/config'

const url = process.env.MONGO_URL
const dbName = process.env.MONGO_DB

export const data = {
    users: null, posts: null,
    ObjectId,
    connect: () => {
        const mongoClient = new MongoClient(url)

        return mongoClient.connect()
            .catch(error => console.error(error))
            .then(() => {
                const db = mongoClient.db(dbName)
                console.info(`Connected to Mongo Server ${url}/${dbName}`)

                data.users = db.collection('users')
                data.posts = db.collection('posts')
            })
    }
}