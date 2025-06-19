import { Router } from 'express';
import getHomeData from './handlers/getHomeData.js';
import getGamesByGenre from './handlers/getGamesByGenre.js';
import searchGames from './handlers/searchGames.js';
import getGameDetails from './handlers/getGameDetails.js';
import getGameStores from './handlers/getGameStores.js';

// Router para las rutas de juegos
const gamesRouter = Router();

// Rutas principales
gamesRouter.get('/home', getHomeData);                    // Obtener datos del home
gamesRouter.get('/genre/:genreSlug', getGamesByGenre);    // Obtener juegos por género
gamesRouter.get('/search', searchGames);                  // Buscar juegos

// Rutas para detalles de juegos
gamesRouter.get('/:gameId', getGameDetails);              // Obtener detalles de un juego
gamesRouter.get('/:gameId/stores', getGameStores);        // Obtener tiendas de un juego

export default gamesRouter;