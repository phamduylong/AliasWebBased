import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game } from '$lib/types';
import { ClientResponseError } from 'pocketbase';
export const load = (async ({ locals, params }) => {
	try {
		const gameId = params.gameid || "";
		const gamesCollection = locals.pocketBase.collection('games');
		if (!gamesCollection) {
			throw error(500, 'Database failure: Games collection is missing from database.');
		}
		return await gamesCollection.getFirstListItem<Game>(`game_id="${gameId}"`);
	} catch (err) {
		console.error(err);
		if (err instanceof ClientResponseError) {
			console.error(err.response.message);
			if (err.response.code === 404) {
				throw error(404, 'Game not found. Check the game ID and try again.');
			} else {
				throw error(
					err.response.code,
					err.response.message ||
						'Unknown error occurred. Check the server logs for more information.'
				);
			}
		}
		throw error(500, (err as Error).message || err.body.message);
	}
}) satisfies PageServerLoad;
