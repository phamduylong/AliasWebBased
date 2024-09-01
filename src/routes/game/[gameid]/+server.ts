import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Game } from '$lib/types';
import { ClientResponseError } from 'pocketbase';
import { validateGame } from '$lib/helpers/common';
export const POST: RequestHandler = async ({ locals, request }) => {
	const gamesCollection = locals.pocketBase.collection('games');
	const game: Game = await request.json();
	try {
		const currGame = await gamesCollection.getFirstListItem(`game_id="${game.game_id}"`);
		currGame.words = game.words;
		currGame.team1_score = game.team1_score;
		currGame.team2_score = game.team2_score;
		const errors = validateGame(currGame);
		if (errors.length !== 0) {
			throw error(400, errors.join(', '));
		}
		gamesCollection.update<Game>(currGame.id, currGame);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.message);
		}
		throw err;
	}
	redirect(303, `/game/${game.game_id}`);
};
