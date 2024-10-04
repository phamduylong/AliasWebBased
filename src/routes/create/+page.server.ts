import { error } from '@sveltejs/kit';
import { uid } from '$lib/helpers/common';
import type { Game, Word } from '$lib/types';
import { validateGame } from '$lib/helpers/common';
export const actions = {
	default: async ({ locals, request }) => {
		const gameId: string = uid();
		const formData: FormData = await request.formData();
		let words: string[] = JSON.parse((formData.get('words') as string) || '[]');
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

		const errors: string[] = validateGame(newGame);
		if (errors.length !== 0) {
			throw error(400, errors.join(', '));
		}
		const gamesCollection = locals.pocketBase.collection('games');
		// @ts-ignore
		await gamesCollection.create<Game>(newGame);

		return { success: true, gameId: gameId };
	}
};
