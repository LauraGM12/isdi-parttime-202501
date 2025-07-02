import { Router } from 'express';
import getHomeData from './handlers/getHomeData.js';
import getGamesByGenre from './handlers/getGamesByGenre.js';
import getGamesByPlatform from './handlers/getGamesByPlatform.js';
import searchGames from './handlers/searchGames.js';
import getGameDetails from './handlers/getGameDetails.js';
import getGameStores from './handlers/getGameStores.js';
import getGenres from './handlers/getGenres.js';
import getPlatforms from './handlers/getPlatforms.js';

const gamesRouter = Router();

gamesRouter.get('/home', getHomeData);                 
gamesRouter.get('/genre/:genreSlug', getGamesByGenre);   
gamesRouter.get('/platform/:platformId', getGamesByPlatform);
gamesRouter.get('/search', searchGames);                
gamesRouter.get('/genres', getGenres);                  
gamesRouter.get('/platforms', getPlatforms);            
gamesRouter.get('/:gameId', getGameDetails);          
gamesRouter.get('/:gameId/stores', getGameStores);       

export default gamesRouter;