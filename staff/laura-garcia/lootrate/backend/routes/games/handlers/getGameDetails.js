import { getGameDetails, getGameStores, getGameScreenshots } from '../../../services/rawgService.js';

const getGameDetailsHandler = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Validar que gameId sea un número válido
    if (!gameId || isNaN(Number(gameId))) {
      return res.status(400).json({ error: 'ID de juego inválido' });
    }
    
    // Obtener detalles básicos del juego
    const gameDetails = await getGameDetails(gameId);
    
    // Obtener capturas de pantalla
    let screenshots = [];
    try {
      screenshots = await getGameScreenshots(gameId);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
      // Continuar incluso si hay error con las capturas
    }
    
    // Combinar los datos
    const gameData = {
      ...gameDetails,
      screenshots
    };
    
    res.status(200).json(gameData);
  } catch (error) {
    console.error('Error in getGameDetails handler:', error);
    
    // Mejorar los mensajes de error
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.status(500).json({ error: 'Error al obtener detalles del juego' });
  }
};

export default getGameDetailsHandler;