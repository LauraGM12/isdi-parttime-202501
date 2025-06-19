import { getGameStores } from '../../../logic/games/rawgService.js'

/**
 * Handler para obtener las tiendas donde está disponible un juego específico
 * Este endpoint permite consultar en qué tiendas digitales se puede comprar un juego
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @returns {Promise<void>} - Respuesta JSON con las tiendas del juego
 */
const getGameStoresHandler = async (req, res) => {
  try {
    // Extraemos el ID del juego desde los parámetros de la URL
    const { gameId } = req.params;
    
    // Validamos que se proporcione el ID del juego
    if (!gameId) {
      return res.status(400).json({ error: 'Se requiere el ID del juego' });
    }
    
    // Llamamos a la función de lógica de negocio para obtener las tiendas
    const stores = await getGameStores(gameId);
    
    // Si todo va bien, retornamos las tiendas con status 200 (OK)
    res.status(200).json(stores);
  } catch (error) {
    // Registramos el error en la consola para debugging
    console.error('Error en el handler getGameStores:', error);
    
    // Retornamos un error 500 (Internal Server Error) con mensaje en español
    res.status(500).json({ error: 'Error al obtener tiendas del juego' });
  }
};

// Exportamos el handler como exportación por defecto
export default getGameStoresHandler;