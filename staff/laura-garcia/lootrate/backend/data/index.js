import mongoose from "mongoose"
import { User, Review, Game } from "./models.js"
const { Types, connect, disconnect } = mongoose

// Configuración de conexión a MongoDB usando Mongoose
export const data = {
    users: User, // Modelo de usuario de Mongoose
    reviews: Review, // Modelo de reseña de Mongoose
    games: Game, // Modelo de juego de Mongoose
    ObjectId: Types.ObjectId, // Tipo ObjectId de MongoDB
    
    // Función para conectar a la base de datos
    connect: (url, dbName) => {
        return connect(`${url}/${dbName}`)
            .catch(error => console.error(error))
            .then(() => {
                console.info(`Conectado al servidor de Mongo ${url}/${dbName}`)
            })
    },
    
    // Función para desconectar de la base de datos
    disconnect: () => {
        return disconnect()
            .then(console.info('Base de datos desconectada'))
            .catch(error => console.error(error))
    }
}