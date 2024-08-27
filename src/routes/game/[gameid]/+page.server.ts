import type {PageServerLoad} from './$types';
export const load = (async ( {locals, params} ) => {
    const gameId = params.gameid;
    const gamesCollection = locals.pocketBase.collection("games");
    const gameData = await gamesCollection.getFirstListItem(`game_id="${gameId}"`);
    return gameData;
}) satisfies PageServerLoad;