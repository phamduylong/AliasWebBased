import { redirect, error } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Game } from '$lib/types';
import { validateGame } from '$lib/helpers/common';
import { ClientResponseError } from 'pocketbase';
export const actions = {
	default: async ({ locals, request }) => {
		const gameId = randomUUID();
		try {
			const formData = await request.formData();
			let words = JSON.parse(formData.get('words') as string);
			for (let i = 0; i < words.length; i++) {
				words[i] = { word: words[i], shown: false };
			}
			const newGame: Game = {
				id: '',
				game_id: gameId,
				team1: formData.get('team-1') as string,
				team2: formData.get('team-2') as string,
				team1_score: 0,
				team2_score: 0,
				words: words,
				is_team1_turn: true
			};
			const errors = validateGame(newGame);
			if (errors.length !== 0) {
				throw error(400, errors.join(', '));
			}
			const gamesCollection = locals.pocketBase.collection('games');
			await gamesCollection.create<Game>(newGame);
		} catch (err) {
			console.error((err as Error).stack);
			if (err instanceof ClientResponseError) {
				throw error(
					err.response.code,
					err.response.message ||
						'Unknown error occurred. Check the server logs for more information.'
				);
			}
			throw error(500, 'An error occurred.');
		}
		// Cannot be in the try catch block because it will catch the redirect
		throw redirect(303, `/game/${gameId}`);
	}
};
