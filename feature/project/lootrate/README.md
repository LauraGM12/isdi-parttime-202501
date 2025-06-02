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

L:
Users: {
  id: objectId
  password: string
  username:string
  email:string
}

Review: {
  author: userId,
  content: string,
  game: gameId
}

Game: {
  id: objectID
  name: ''
  plataform: ['play', 'switch, 'pc'],
  scoreApi,
  scoreByUsers [{
    user: id
    score: number
  }],
  genre: ['adventure', 'fps', 'etc']
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
