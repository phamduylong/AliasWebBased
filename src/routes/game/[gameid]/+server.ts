import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Game } from '$lib/types';
import { ClientResponseError } from 'pocketbase';
import { validateGame } from '$lib/helpers/common';
export const POST: RequestHandler = async ({ locals, request }) => {
	const gamesCollection = locals.pocketBase.collection('games');
	const game: Game = await request.json();
	try {
		const errors = validateGame(game);
		if (errors.length !== 0) {
			throw error(400, errors.join(', '));
		}
		await gamesCollection.update<Game>(game.id, game);
	} catch (err) {
		console.error(err);
		if (err instanceof ClientResponseError) {
			throw error(
				err.response.code,
				err.response.message ||
					'Unknown error occurred. Check the server logs for more information.'
			);
		}
		throw error(500, (err as Error).message || err?.body?.message);
	}
	return new Response('OK', { status: 200 });
};
