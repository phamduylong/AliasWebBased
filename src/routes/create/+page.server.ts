import { error } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Game, Word } from '$lib/types';
import { validateGame } from '$lib/helpers/common';
import { ClientResponseError } from 'pocketbase';
export const actions = {
	default: async ({ locals, request }) => {
		const gameId = randomUUID();
		try {
			const formData = await request.formData();
			let words: string[] = JSON.parse(formData.get('words') as string);
			const wordsArr: Word[] = [];
			// make it a unique Set and then convert it back to an array. This prevents duplicate words to be included in the game.
			words = [...new Set(words)];
			for (const element of words) {
				if (element !== '') {
					wordsArr.push({ word: element, shown: false });
				}
			}
			const newGame: Game = {
				id: '',
				game_id: gameId,
				team1: formData.get('team-1') as string,
				team2: formData.get('team-2') as string,
				team1_score: 0,
				team2_score: 0,
				words: wordsArr,
				is_team1_turn: true,
				turn_started: false
			};

			const errors = validateGame(newGame);
			if (errors.length !== 0) {
				throw error(400, errors.join(', '));
			}
			const gamesCollection = locals.pocketBase.collection('games');
			// @ts-ignore
			await gamesCollection.create<Game>(newGame);
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
		return { success: true, gameId: gameId };
	}
};
