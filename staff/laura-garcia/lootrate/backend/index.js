import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { data } from './data/index.js';
import usersRouter from './routes/users/index.js';
import gamesRouter from './routes/games/index.js';
import reviewsRouter from './routes/reviews/index.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

data.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'lootrate')
  .then(() => console.log('Servidor listo'))
  .catch(error => {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json({ message: 'API LootRate funcionando', status: 'OK' });
});

app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/reviews', reviewsRouter)

app.use(notFoundHandler); 
app.use(errorHandler);     

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});