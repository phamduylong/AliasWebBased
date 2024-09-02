import { redirect, error } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Game } from '$lib/types';
import { validateGame } from '$lib/helpers/common';
import { teamTurn } from '$lib/teamsTurn.js';
export const actions = {
	default: async ({ locals, request }) => {
		const gameId = randomUUID();
		const formData = await request.formData();
		let words = JSON.parse(formData.get('words') as string);
		for (let i = 0; i < words.length; i++) {
			words[i] = { word: words[i], shown: false };
		}
		const newGame: Game = {
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
		await gamesCollection.create(newGame);
		throw redirect(303, `/game/${gameId}`);
	}
};
