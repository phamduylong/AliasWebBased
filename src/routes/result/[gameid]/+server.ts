import type { Game } from '$lib/types';
import { ClientResponseError } from 'pocketbase';
import { error } from '@sveltejs/kit';
export const GET = async ({ locals, params }): Promise<Response> => {
	try {
		const gameID = params.gameid;
		const gamesCollection = locals.pocketBase.collection('games');
		const game = await gamesCollection.getFirstListItem<Game>(`game_id="${gameID}"`);
		return new Response(JSON.stringify(game), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error((err as Error).stack);
		if (err instanceof ClientResponseError)
			throw error(
				err.response.code,
				err.response.message ||
					'Unknown error occurred. Check the server logs for more information.'
			);
		throw error(500, (err as Error).message);
	}
};
