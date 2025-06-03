# Project Name

*Image related to the project*

## Introduction

Provide an awesome description of what your project is, why it exists, and its key objectives.

## Functional Description

### Use Cases

_List all use cases for your app here._

- *(e.g.)* User login
- *(e.g.)* User creation
- *Additional functionalities of your app*

L:
Iniciar sesión,
Crear cuenta,
Cambiar contraseña,
Eliminar usuario,
Buscar juego,
Review de juego,
Puntuar el juego,
Ver ranking por género

## UI/UX Design

Include the link to your Figma design for the app.
https://www.figma.com/design/QmtEii1I54MdI6MtCemmrz/LootRate?node-id=0-1&p=f&t=dpcxdMR4Je51tB2G-0

## Technical Description

### Technologies & Libraries

- React
- Vite
- Tailwind
- react-router
- Express
- Node
- Mongo+Mongoose
- Mocha Chai
- Bcrypt / Token Library (jose, jwt, etc)

### Data Models

// Modelo User
User: {
  id: ObjectId,
  username: String (único),
  email: String (único),
  password: String (hasheado),
  createdAt: Date,
  avatar: String (opcional)
}

// Modelo Game
Game: {
  id: ObjectId,
  rawgId: Number, // ID de la API RAWG
  name: String,
  platforms: [String], // ['PC', 'PlayStation', 'Xbox', 'Switch']
  genres: [String],
  releaseDate: Date,
  apiScore: Number,
  userScores: [{
    user: ObjectId,
    score: Number (1-10)
  }],
  averageUserScore: Number,
  imageUrl: String
}

// Modelo Review
Review: {
  id: ObjectId,
  author: ObjectId,
  game: ObjectId,
  content: String,
  score: Number (1-10),
  createdAt: Date,
  updatedAt: Date
}

Data models describe how the database saves documents.

[Learn more about data modeling here.](https://www.mongodb.com/resources/basics/databases/data-modeling)

***(e.g.)* User Model**
- *(e.g.)* id (ObjectId)
- *(e.g.)* username (string)
- *(e.g.)* password (string)
- *(e.g.)* avatar (string)

_Additional data models as needed._

### Test Coverage

</br>

_Include a table or screenshot of your backend test coverage here._

## Project

If you have deployed your app, add the link here!
