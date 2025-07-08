# LOOTRATE

![LootRate](./app-lootrate.jpg)

## Descripción

LootRate es una plataforma gaming full-stack que permite a los usuarios descubrir, reseñar y calificar videojuegos. Los usuarios pueden buscar juegos, escribir reseñas detalladas, puntuar juegos del 1 al 10, crear listas personalizadas de juegos e interactuar con las reseñas de otros gamers a través de likes y comentarios. La plataforma se integra con la API de RAWG para proporcionar datos completos de juegos y crear una experiencia gaming impulsada por la comunidad.

## Descripción Funcional

### Características Principales
- Autenticación de usuarios y gestión de perfiles
- Búsqueda y descubrimiento de juegos
- Sistema de reseñas y calificaciones
- Gestión de listas de juegos (favoritos, lista de deseos, completados)
- Sistema de comentarios en reseñas
- Interacciones de me gusta/no me gusta
- Filtrado por género y plataforma
- Diseño responsivo

### Casos de Uso
- Registro e inicio de sesión de usuarios
- Creación y gestión de perfiles
- Funcionalidad de cambio de contraseña
- Eliminación de cuenta
- Búsqueda y navegación de juegos
- Escritura y edición de reseñas de juegos
- Calificación de juegos (escala 1-10)
- Creación y gestión de listas de juegos
- Comentarios en reseñas
- Dar me gusta/no me gusta a reseñas
- Ver rankings por género
- Descubrir juegos por plataforma

## Diseño UI/UX

https://www.figma.com/design/QmtEii1I54MdI6MtCemmrz/LootRate?t=xyzXPFLiN3K0xD72-0

## Descripción Técnica

### Tecnologías y Librerías

#### Frontend
- React 19.1.0
- Vite 6.3.5
- Tailwind CSS 4.1.8
- React Router DOM 7.6.0
- Redux y React-Redux
- Axios
- JWT Decode
- Bootstrap Icons
- Styled Components

#### Backend
- Node.js
- Express 5.1.0
- MongoDB y Mongoose 8.15.1
- JWT (jsonwebtoken)
- Bcrypt.js
- Axios (para API RAWG)
- CORS
- Dotenv

#### Testing y Desarrollo
- Mocha y Chai
- C8 (Cobertura de Código)
- ESLint
- Esmock

#### APIs Externas
- **API de Base de Datos de Videojuegos RAWG**
- **MongoDB Atlas**

## Endpoints de la API

### Autenticación
- POST   /api/users/           - Registrar nuevo usuario
- POST   /api/users/auth       - Inicio de sesión de usuario

### Perfil de Usuario
- GET    /api/users/profile/own              - Obtener perfil propio
- GET    /api/users/profile/user/:username   - Obtener perfil de usuario por nombre de usuario
- PUT    /api/users/profile                  - Actualizar perfil
- PUT    /api/users/change-password          - Cambiar contraseña
- DELETE /api/users/account                  - Eliminar cuenta

### Listas de Juegos
- POST   /api/users/lists/add                     - Agregar juego a lista
- DELETE /api/users/lists/remove                  - Quitar juego de lista
- GET    /api/users/lists/own/:listType           - Obtener lista propia de juegos
- GET    /api/users/lists/user/:username/:listType - Obtener lista de juegos del usuario

### Juegos
- GET    /api/games/home                    - Obtener datos de página de inicio
- GET    /api/games/genre/:genreSlug        - Obtener juegos por género
- GET    /api/games/platform/:platformSlug  - Obtener juegos por plataforma
- GET    /api/games/search                  - Buscar juegos
- GET    /api/games/:gameId                 - Obtener detalles del juego
- GET    /api/games/:gameId/stores          - Obtener tiendas del juego
- GET    /api/games/genres                  - Obtener todos los géneros
- GET    /api/games/platforms               - Obtener todas las plataformas

### Reseñas
- POST   /api/reviews/                    - Crear reseña
- GET    /api/reviews/user/:userId        - Obtener reseñas del usuario
- GET    /api/reviews/game/:gameId        - Obtener reseñas del juego
- PUT    /api/reviews/:reviewId           - Actualizar reseña
- DELETE /api/reviews/:reviewId          - Eliminar reseña
- POST   /api/reviews/:reviewId/like      - Alternar me gusta en reseña

### Comentarios
- POST   /api/reviews/:reviewId/comments           - Agregar comentario a reseña
- GET    /api/reviews/:reviewId/comments           - Obtener comentarios de reseña
- PUT    /api/reviews/:reviewId/comments/:commentId - Actualizar comentario
- DELETE /api/reviews/:reviewId/comments/:commentId - Eliminar comentario

## Modelos de Datos

### Esquema de Usuario

{
  _id: ObjectId,
  username: String (único),
  email: String (único),
  password: String (hasheado),
  avatar: String (opcional),
  createdAt: Date,
  updatedAt: Date
}

### Esquema de Juego
{
  _id: ObjectId,
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

### Esquema de Reseña
{
  _id: ObjectId,
  author: ObjectId,
  game: ObjectId,
  content: String,
  score: Number (1-10),
  likes: [ObjectId], // Array de IDs de usuarios que dieron me gusta
  comments: [{
    author: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

### Test Coverage
![Coverage](./test-coverage.jpg)

### Link del Proyecto
https://lootrate.surge.sh/