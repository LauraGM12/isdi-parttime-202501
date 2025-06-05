import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { data } from './data/index.js';
import usersRouter from './routes/users/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

// Cargar variables de entorno
const PORT = process.env.PORT
dotenv.config();

const app = express();
/*const PORT = process.env.PORT || 3001;*/

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
data.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'lootrate')
  .then(() => console.log('Servidor listo'))
  .catch(error => {
    console.error('Error conectando a la BD:', error);
    process.exit(1);
  });

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API LootRate funcionando', status: 'OK' });
});

// Rutas de la API
app.use('/api/users', usersRouter);

//AÑADIR: Middlewares de manejo de errores (SIEMPRE al final)
app.use(notFoundHandler);  // 404
app.use(errorHandler);     // Errores generales

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});