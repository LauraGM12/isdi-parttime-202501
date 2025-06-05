import mongoose from "mongoose"
/*import { User, Post } from "./models.js"*/
import { User } from "./models.js"
const { Types, connect, disconnect } = mongoose

// Configuración de conexión a MongoDB usando Mongoose
export const data = {
    users: User, // Modelo de usuario de Mongoose
 /*   posts: Post, // Modelo de post de Mongoose*/
    ObjectId: Types.ObjectId, // Tipo ObjectId de MongoDB
    
    // Función para conectar a la base de datos
    connect: (url, dbName) => {
        return connect(`${url}/${dbName}`)
            .catch(error => console.error(error))
            .then(() => {
                console.info(`Connected to Mongo Server ${url}/${dbName}`)
            })
    },
    
    // Función para desconectar de la base de datos
    disconnect: () => {
        return disconnect()
            .then(console.info('db disconected'))
            .catch(error => console.error(error))
    }
}