import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game } from '$lib/types';
export const load = (async ({ locals, params }) => {
	const gameId : string = params.gameid || "";
	const gamesCollection = locals.pocketBase.collection('games');
	if (!gamesCollection) {
		throw error(500, 'Database failure: Games collection is missing from database.');
	}
	return await gamesCollection.getFirstListItem<Game>(`game_id="${gameId}"`);
}) satisfies PageServerLoad;
