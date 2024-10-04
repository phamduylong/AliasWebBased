import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Game } from '$lib/types';
import { validateGame } from '$lib/helpers/common';
export const POST: RequestHandler = async ({ locals, request }) => {
	const gamesCollection = locals.pocketBase.collection('games');
	const game: Game = await request.json();
		const errors = validateGame(game);
		if (errors.length !== 0) {
			throw error(400, errors.join(', '));
		}
		await gamesCollection.update<Game>(game.id, game);

	return new Response('OK', { status: 200 });
};
