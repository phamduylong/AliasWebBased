import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game } from '$lib/types';
import { ClientResponseError } from 'pocketbase';
export const load = (async ({ locals, params }) => {
	try {
		const gameId = params.gameid;
		const gamesCollection = locals.pocketBase.collection('games');
		const gameData : Game = await gamesCollection.getFirstListItem(`game_id="${gameId}"`);
		return gameData;
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.message);
		}
		throw err;
	}
}) satisfies PageServerLoad;
