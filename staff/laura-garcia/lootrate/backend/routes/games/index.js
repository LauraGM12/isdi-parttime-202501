import { Router } from 'express';
import getHomeData from './handlers/getHomeData.js';
import getGamesByGenre from './handlers/getGamesByGenre.js';
import getGamesByPlatform from './handlers/getGamesByPlatform.js';
import searchGames from './handlers/searchGames.js';
import getGameDetails from './handlers/getGameDetails.js';
import getGameStores from './handlers/getGameStores.js';
import getGenres from './handlers/getGenres.js';
import getPlatforms from './handlers/getPlatforms.js';

// Router para las rutas de juegos
const gamesRouter = Router();

// Rutas principales
gamesRouter.get('/home', getHomeData);                    // Obtener datos del home
gamesRouter.get('/genre/:genreSlug', getGamesByGenre);    // Obtener juegos por género
gamesRouter.get('/platform/:platformId', getGamesByPlatform); // Obtener juegos por plataforma
gamesRouter.get('/search', searchGames);                  // Buscar juegos
gamesRouter.get('/genres', getGenres);                    // Obtener géneros disponibles
gamesRouter.get('/platforms', getPlatforms);              // Obtener plataformas disponibles

// Rutas para detalles de juegos
gamesRouter.get('/:gameId', getGameDetails);              // Obtener detalles de un juego
gamesRouter.get('/:gameId/stores', getGameStores);        // Obtener tiendas de un juego

export default gamesRouter;