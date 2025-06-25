import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { data } from './data/index.js';
import usersRouter from './routes/users/index.js';
import gamesRouter from './routes/games/index.js';
import reviewsRouter from './routes/reviews/index.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
// Aumentar el límite de tamaño para JSON
app.use(express.json({ limit: '10mb' })); // Cambiar de 100kb (predeterminado) a 10mb
// También para datos URL-encoded si se utilizan
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Conectar a la base de datos
data.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'lootrate')
  .then(() => console.log('Servidor listo'))
  .catch(error => {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  });

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API LootRate funcionando', status: 'OK' });
});

// Rutas de la API
app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/reviews', reviewsRouter)

// Middlewares de manejo de errores (SIEMPRE al final)
app.use(notFoundHandler);  // Manejo de rutas no encontradas (404)
app.use(errorHandler);     // Manejo de errores generales

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});