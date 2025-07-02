import mongoose from "mongoose"
import { User, Review, Game } from "./models.js"
const { Types, connect, disconnect } = mongoose

export const data = {
    users: User, 
    reviews: Review, 
    games: Game, 
    ObjectId: Types.ObjectId, 
    
    connect: (url, dbName) => {
        return connect(`${url}/${dbName}`)
            .catch(error => console.error(error))
            .then(() => {
                console.info(`Conectado al servidor de Mongo ${url}/${dbName}`)
            })
    },

    disconnect: () => {
        return disconnect()
            .then(console.info('Base de datos desconectada'))
            .catch(error => console.error(error))
    }
}