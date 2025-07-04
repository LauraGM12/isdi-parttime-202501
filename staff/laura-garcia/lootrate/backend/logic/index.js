import * as users from './users/index.js'
import * as homeDataModule from "./games/getHomeData.js"
import { searchGames } from "./games/searchGames.js"
import * as reviewsLogic from "./reviews/index.js"

export const games = {
    getHomeData: homeDataModule.getHomeData,
    getGamesByGenre: homeDataModule.getGamesByGenre,
    searchGames
}

export const reviews = reviewsLogic

export { users }