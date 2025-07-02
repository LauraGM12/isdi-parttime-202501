import { getGameDetails, getGameStores, getGameScreenshots } from '../../../services/rawgService.js';

const getGameDetailsHandler = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!gameId || isNaN(Number(gameId))) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }
    
    const gameDetails = await getGameDetails(gameId);
    
    let screenshots = [];
    try {
      screenshots = await getGameScreenshots(gameId);
    } catch (error) {
    }
    
    const gameData = {
      ...gameDetails,
      screenshots
    };
    
    res.status(200).json(gameData);
  } catch (error) {    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.status(500).json({ error: 'Error al obtener detalles del juego' });
  }
};

export default getGameDetailsHandler;